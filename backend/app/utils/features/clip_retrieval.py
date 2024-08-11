import os
import faiss
from timeit import default_timer as timer

from .models import PROJECT_ROOT
import json
import torch
import clip
import open_clip
from PIL import Image


class ClipRetrieval:
    """Returns top k most similar results to the queries.
        Types of queries are: txt, img, reconstruct ids. Must provide at least one query type.
        IMPORTANT: TO CHANGE THE ACTIVE MODEL, CALL reload_model(model_key) BEFOREHAND.

        Args:
            txt_query (list[str] | None, optional): shape (n_txt_query, )
            img_query (PIL.Image.Image | None, optional): image must be resized beforehand
            reconstruct_ids (optional): An iterable of ids to reconstruct

        Raises:
            ValueError: If none of the query types are provided.

        Returns:
            dict: A dictionary with keys 'txt', 'img', 'recon' and values 'scores' and 'indices' with shape (n_query, k).
    """

    def __init__(
        self,
        clip_model_info: str = os.path.join(PROJECT_ROOT, "dict/clip/clip_model_info.json"),
    ):
        self.model_info = json.load(clip_model_info)
        self.model_keys = sorted(self.model_info.keys())
        self.active_model = self.model_keys[0]

        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        self.faiss_index = self.read_index_gpu(self.active_model)
        self.clip_model, self.clip_tokenizer, self.clip_preprocess = self.load_clip(self.active_model)

    def __call__(
        self,
        txt_query: list[str] | None = None,
        img_query: Image.Image | None = None,
        reconstruct_ids=None,
        k: int = 100,
    ):
        if txt_query is None and img_query is None and reconstruct_ids is None:
            raise ValueError("Either txt_query or img_query or reconstruct_ids should be provided.")

        query_types = {
            'txt': (txt_query, self.encode_text),
            'img': (img_query, self.encode_image),
            'recon': (reconstruct_ids, self.reconstruct)
        }

        features = []
        for _, (query, encode) in query_types.items():
            if query is not None:
                features.append(encode(query))

        query = torch.cat(features, dim=0)
        scores, indices = self.search(query, k)
        # shape (n_txt_query + 1(Image) + len(reconstruct_ids), k)
        results = {}
        start_idx = 0
        for key, (query, _) in query_types.items():
            if query is not None:
                end_idx = start_idx + (len(query) if key != 'img' else 1)
                results[key] = {
                    'scores': scores[start_idx:end_idx],
                    'indices': indices[start_idx:end_idx]
                }
                start_idx = end_idx

        return results

    def encode_text(self, txt_query: list[str]):
        query = self.clip_tokenizer(txt_query, return_tensors="pt").to(self.device)
        txt_features = self.clip_model.encode_text(query)
        txt_features /= txt_features.norm(dim=-1, keepdim=True)

        return txt_features

    def encode_image(self, img_query: Image.Image):
        img = self.clip_preprocess(img_query).unsqueeze(0).to(self.device)
        img_features = self.clip_model.encode_image(img)
        img_features /= img_features.norm(dim=-1, keepdim=True)

        return img_features

    def reconstruct(self, ids: list[int]):
        recon_vectors = []
        for id in ids:
            recon = self.faiss_index.reconstruct(id).reshape(1, -1)
            recon_vectors.append(recon)

        recon_tensor = torch.tensor(recon_vectors).to(self.device)
        return recon_tensor

    def search(self, query: torch.Tensor, k: int):
        '''Search for similarity between query and indexed CLIP features.
        Params:
            query: shape (n_query, d)
            
        Return:
            scores: shape (n_query, k)
            indices: shape (n_query, k)
        '''
        return self.faiss_index.search(query, k=k)

    def reload_model(self, model_key):
        if model_key == self.active_model:
            return

        self.active_model = model_key
        self.faiss_index = self.read_index_gpu(self.active_model)
        self.clip_model, self.clip_tokenizer, self.clip_preprocess = self.load_clip(self.active_model)

    def load_clip(self, model_key):
        model_info = self.model_info[model_key]
        model = model_info['model']
        pretrained = model_info['pretrained']

        if model_info['version'] == "openclip":
            clip_model, _, clip_preprocess = open_clip.create_model_and_transforms(
                model, device=self.device, pretrained=pretrained)
            clip_tokenizer = open_clip.get_tokenizer(model)
        else:
            clip_model, clip_preprocess = clip.load(model, device=self.device)
            clip_tokenizer = clip.tokenize

        return clip_model, clip_tokenizer, clip_preprocess

    @staticmethod
    def read_index_gpu(model_key):
        model_path = os.path.join(PROJECT_ROOT, "dict/faiss_clip_index", f'{model_key}.bin')
        res = faiss.StandardGpuResources()
        index = faiss.read_index(model_path)
        index_gpu = faiss.index_cpu_to_gpu(res, 0, index)

        return index_gpu
