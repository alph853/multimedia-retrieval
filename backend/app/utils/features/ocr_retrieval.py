import glob
import os
import faiss
from timeit import default_timer as timer
from .configs import PROJECT_ROOT, sentence_transformer_model


DEBUG = True


class OcrRetrieval:
    """Input n OCR queries and return a tuple of scores and indices, shape `(n, k)` each.
    """
    def __init__(self, ocr_path="dict/ocr/ocr_encoded.bin"):
        self.ocr_path = ocr_path
        self.model = sentence_transformer_model
        self.ocr_matrix = faiss.read_index(os.path.join(PROJECT_ROOT, ocr_path))
        
        if DEBUG:
            self.inference = load_inference()
            

    def __call__(self, query: list[str], k: int = 100):
        query_embed = self.model.encode(query)
        query_embed = query_embed.cpu().numpy().astype("float32")
        scores, top_k_indices = self.ocr_matrix.search(query_embed, k)
        return scores, top_k_indices

    
def load_inference(ocr_path = 'dict/ocr/inference'):
    inference = []
    for batch_key in os.listdir(ocr_path):
        batch_path = os.path.join(ocr_path, batch_key)
        
        for inference_path in glob.glob(os.path.join(batch_path, '*.txt')):
            with open(inference_path, 'r') as f:
                inference.extend(f.readlines())