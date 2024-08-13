import os
import faiss
from timeit import default_timer as timer
from .models import PROJECT_ROOT, sentence_transformer_model


class OcrRetrieval:
    """Input n OCR queries and return a tuple of scores and indices, shape `(n, k)` each.
    """
    def __init__(self, ocr_path="dict/ocr/ocr_encoded.bin"):
        self.ocr_path = ocr_path
        self.model = sentence_transformer_model
        self.ocr_matrix = faiss.read_index(os.path.join(PROJECT_ROOT, ocr_path))

    def __call__(self, query: list[str], k: int = 100):
        query_embed = self.model.encode(query)
        scores, top_k_indices = self.ocr_matrix.search(query_embed, k)
        return scores, top_k_indices
