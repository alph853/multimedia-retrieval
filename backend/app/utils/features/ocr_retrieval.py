import glob
import os
import pickle
import faiss
from timeit import default_timer as timer
from .configs import PROJECT_ROOT, sentence_transformer_model

from sklearn.feature_extraction.text import TfidfVectorizer
from .utils import merge_list_results, encode_tfidf
import scipy as sp


class OcrRetrieval:
    """Input n OCR queries and return a tuple of scores and indices, shape `(n, k)` each.
    """
    def __init__(self, ocr_path="dict/ocr/ocr_encoded.bin", tfidf_transform_paths="dict/ocr/ocr_tfidf_transform.pkl", tfidf_matrix_path="dict/ocr/ocr_encoded.npz"):
        self.tfidf_matrix = sp.sparse.load_npz(os.path.join(PROJECT_ROOT, tfidf_matrix_path))
        self.tfidf_transformer = pickle.load(open(os.path.join(PROJECT_ROOT, tfidf_transform_paths), "rb"))
        self.ocr_path = ocr_path
        self.model = sentence_transformer_model
        self.ocr_matrix = faiss.read_index(os.path.join(PROJECT_ROOT, ocr_path))
        
    def __call__(self, query: list[str], k: int = 100):
        query_embed = self.model.encode(query)
        query_embed = query_embed.cpu().numpy().astype("float32")
        
        scores1, top_k_indices1 = self.ocr_matrix.search(query_embed, k)
        
        query = [[q] for q in query]
        scores2, top_k_indices2 = encode_tfidf(query, self.tfidf_transformer, self.tfidf_matrix, k)

        scores = []
        top_k_indices = []
                
        for score1, score2, top_k_indices1, top_k_indices2 in zip(scores1, scores2, top_k_indices1, top_k_indices2):
            score, top_k_index = (merge_list_results([score1, score2], [top_k_indices1, top_k_indices2], k, normalize=True))
            scores.append(score)
            top_k_indices.append(top_k_index)
        print('ocr', scores, top_k_indices)
        return scores, top_k_indices    
