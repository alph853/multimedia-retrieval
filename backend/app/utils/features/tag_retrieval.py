from .configs import PROJECT_ROOT
import scipy as sp
import os
import pickle
import numpy as np
from .utils import encode_tfidf


class TagRetrieval:
    def __init__(self, tags_path="dict/tag/tag_encoded.npz", tfidf_transformer_path="dict/tag/tag_tfidf_transform.pkl"):
        self.tag_paths = tags_path
        self.tfidf_transformer_path = tfidf_transformer_path

        self.tags_matrix = sp.sparse.load_npz(os.path.join(PROJECT_ROOT, tags_path))

        # self.check(self.tags_matrix)

        with open(os.path.join(PROJECT_ROOT, tfidf_transformer_path), 'rb') as f:
            self.tfidf_transformer = pickle.load(f)

    def __call__(self, q: list[str], k: int):
        query = preprocess(q)
        scores, top_k_indices = encode_tfidf(query, self.tfidf_transformer, self.tags_matrix, k)

        return scores, top_k_indices

    # def check(self, tags_matrix):
    #     total_elements = tags_matrix.shape[0] * tags_matrix.shape[1]
    #     non_zero_elements = tags_matrix.nnz
    #     print(f"Total elements: {total_elements}, Non-zero elements: {non_zero_elements}")
    #     sparsity = 1 - (non_zero_elements / total_elements)
    #     # A value close to 1 indicates high sparsity
    #     print(f"Sparsity: {sparsity:.4f}")


def preprocess(query: list[str]):
    for i, tag_query in enumerate(query):
        if isinstance(tag_query, list):
            tag_query = [tag.replace(' ', '_') for tag in tag_query]
        query[i] = [' '.join(tag_query).lower()]
    return query