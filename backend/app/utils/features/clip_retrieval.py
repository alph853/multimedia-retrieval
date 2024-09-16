import os
import faiss
from timeit import default_timer as timer

import numpy as np

from .configs import PROJECT_ROOT, translator
import json
import torch
import clip
import open_clip
from PIL import Image


class ClipRetrieval:
    """
    Find top k most similar results to the provided queries.

    Types of queries supported: text, image, and reconstruction IDs. At least one query type must be provided.

    To change the active model, call `reload_model(model_key)`.
    
    Raises:
        ValueError: If all query types are None.

    Args:
        query (dict) : A dictionary with keys 'txt', 'img', 'recon', and values shape `(n_query, )` for each query types. 

    Returns:
        result (dict): A dictionary with keys `'txt'`, `'img'`, and `'recon'`, and values `('scores' and 'indices')` each. 
    """

    def __init__(
        self,
        clip_model_info: str = os.path.join(PROJECT_ROOT, "dict/clip/clip_model_info.json"),
        faiss_device: str = "cuda",
    ):
        self.model_info = json.load(open(clip_model_info, 'r'))
        self.model_keys = sorted(self.model_info.keys())
        self.active_model = self.model_keys[1]
        self.faiss_device = faiss_device

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.translator = translator

        self.faiss_index = self.read_index(self.active_model, faiss_device)
        self.clip_model, self.clip_tokenizer, self.clip_preprocess = self.load_clip(self.model_info[self.active_model])

    def __call__(
        self,
        query: dict[str: list[str] | Image.Image | list[int] | None],
        k: int = 100,
    ):
        if all(q is None for q in query.values()):
            raise ValueError("At least one query type must be provided.")

        query['txt'] = [self.translator(q) for q in query['txt']] if query['txt'] is not None else None
        query_types = {
            'txt': (query['txt'], self.encode_text),
            'img': (query['img'], self.encode_image),
            'idx': (query['idx'], self.reconstruct)
        }

        features = []
        for _, (q, encoder) in query_types.items():
            if q is not None:
                query_features = encoder(q)
                features.append(query_features)

        features = torch.cat(features, dim=0)
        features = features.cpu().detach().numpy().astype(np.float32)

        scores, indices = self.search(features, k)
        # shape (n_txt_query + 1(Image) + len(reconstruct_ids), k)
        results = {}
        start_idx = 0
        for key, (q, _) in query_types.items():
            if q is not None:
                end_idx = start_idx + (len(q) if key != 'img' else 1)
                results[key] = (scores[start_idx:end_idx], indices[start_idx:end_idx])
                start_idx = end_idx

                if key == 'txt':
                    for i, score in enumerate(scores):
                        scores[i] = score / np.max(score)
        return results

    def encode_text(self, txt_query: list[str]):
        query = self.clip_tokenizer(txt_query).to(self.device)
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
            recon = self.faiss_index.reconstruct(id)
            recon_vectors.append(recon)

        recon_tensor = torch.tensor(np.array(recon_vectors)).to(self.device)
        return recon_tensor

    def search(self, query: np.ndarray, k: int):
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
        self.faiss_index = self.read_index(self.active_model, self.faiss_device)

        model_info = self.model_info[model_key]
        self.clip_model, self.clip_tokenizer, self.clip_preprocess = self.load_clip(model_info)

    @staticmethod
    def load_clip(model_info, device="cuda"):
        model = model_info['model']

        print(f"Loading model: {json.dumps(model_info, indent=2)}")

        if model_info['version'] == "openclip":
            pretrained = model_info['pretrained']
            clip_model, _, clip_preprocess = open_clip.create_model_and_transforms(
                model, device=device, pretrained=pretrained)
            clip_tokenizer = open_clip.get_tokenizer(model)
        else:
            clip_model, clip_preprocess = clip.load(model, device=device)
            clip_tokenizer = clip.tokenize

        return clip_model, clip_tokenizer, clip_preprocess

    @staticmethod
    def read_index(model_key, device):
        model_path = os.path.join(PROJECT_ROOT, "dict/clip", f'{model_key}.bin')

        if device == 'cuda':
            res = faiss.StandardGpuResources()
            index = faiss.read_index(model_path)
            index = faiss.index_cpu_to_gpu(res, 0, index)
        else:
            index = faiss.read_index(model_path)

=======
import os
import faiss
from timeit import default_timer as timer

import numpy as np

from .configs import PROJECT_ROOT, translator
import json
import torch
import clip
import open_clip
from PIL import Image


class ClipRetrieval:
    """
    Find top k most similar results to the provided queries.

    Types of queries supported: text, image, and reconstruction IDs. At least one query type must be provided.

    To change the active model, call `reload_model(model_key)`.
    
    Raises:
        ValueError: If all query types are None.

    Args:
        query (dict) : A dictionary with keys 'txt', 'img', 'recon', and values shape `(n_query, )` for each query types. 

    Returns:
        result (dict): A dictionary with keys `'txt'`, `'img'`, and `'recon'`, and values `('scores' and 'indices')` each. 
    """

    def __init__(
        self,
        clip_model_info: str = os.path.join(PROJECT_ROOT, "dict/clip/clip_model_info.json"),
        faiss_device: str = "cpu",
    ):
        self.model_info = json.load(open(clip_model_info, 'r'))
        self.model_keys = sorted(self.model_info.keys())
        self.active_model = self.model_keys[1]
        self.faiss_device = faiss_device

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.translator = translator

        self.faiss_index = self.read_index(self.active_model, faiss_device)
        self.clip_model, self.clip_tokenizer, self.clip_preprocess = self.load_clip(self.model_info[self.active_model])

    def __call__(
        self,
        query: dict[str: list[str] | Image.Image | list[int] | None],
        k: int = 100,
    ):
        if all(q is None for q in query.values()):
            raise ValueError("At least one query type must be provided.")

        query['txt'] = [self.translator(q) for q in query['txt']] if query['txt'] is not None else None
        query_types = {
            'txt': (query['txt'], self.encode_text),
            'img': (query['img'], self.encode_image),
            'idx': (query['idx'], self.reconstruct)
        }

        features = []
        for _, (q, encoder) in query_types.items():
            if q is not None:
                query_features = encoder(q)
                features.append(query_features)

        features = torch.cat(features, dim=0)
        features = features.cpu().detach().numpy().astype(np.float32)

        scores, indices = self.search(features, k)
        # shape (n_txt_query + 1(Image) + len(reconstruct_ids), k)
        results = {}
        start_idx = 0
        for key, (q, _) in query_types.items():
            if q is not None:
                end_idx = start_idx + (len(q) if key != 'img' else 1)
                results[key] = (scores[start_idx:end_idx], indices[start_idx:end_idx])
                start_idx = end_idx

                if key == 'txt':
                    for i, score in enumerate(scores):
                        scores[i] = score / np.max(score)
        return results

    def encode_text(self, txt_query: list[str]):
        query = self.clip_tokenizer(txt_query).to(self.device)
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
            recon = self.faiss_index.reconstruct(id)
            recon_vectors.append(recon)

        recon_tensor = torch.tensor(np.array(recon_vectors)).to(self.device)
        return recon_tensor

    def search(self, query: np.ndarray, k: int):
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
        self.faiss_index = self.read_index(self.active_model, self.faiss_device)

        model_info = self.model_info[model_key]
        self.clip_model, self.clip_tokenizer, self.clip_preprocess = self.load_clip(model_info)

    @staticmethod
    def load_clip(model_info, device="cuda"):
        model = model_info['model']

        print(f"Loading model: {json.dumps(model_info, indent=2)}")

        if model_info['version'] == "openclip":
            pretrained = model_info['pretrained']
            clip_model, _, clip_preprocess = open_clip.create_model_and_transforms(
                model, device=device, pretrained=pretrained)
            clip_tokenizer = open_clip.get_tokenizer(model)
        else:
            clip_model, clip_preprocess = clip.load(model, device=device)
            clip_tokenizer = clip.tokenize

        return clip_model, clip_tokenizer, clip_preprocess

    @staticmethod
    def read_index(model_key, device):
        model_path = os.path.join(PROJECT_ROOT, "dict/clip", f'{model_key}.bin')

        if device == 'cuda':
            res = faiss.StandardGpuResources()
            index = faiss.read_index(model_path)
            index = faiss.index_cpu_to_gpu(res, 0, index)
        else:
            index = faiss.read_index(model_path)
        return index