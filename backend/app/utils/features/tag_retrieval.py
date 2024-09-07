from .configs import PROJECT_ROOT
import scipy as sp
import os
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np


class TagRetrieval:
    def __init__(self, tags_path="dict/tag/tag_encoded.npz", tfidf_transformer_path="dict/tag/tag_tfidf_transform.pkl"):
        self.tag_paths = tags_path
        self.tfidf_transformer_path = tfidf_transformer_path

        self.tags_matrix = sp.sparse.load_npz(os.path.join(PROJECT_ROOT, tags_path))

        self.check(self.tags_matrix)

        with open(os.path.join(PROJECT_ROOT, tfidf_transformer_path), 'rb') as f:
            self.tfidf_transformer = pickle.load(f)

    def __call__(self, q: list[str], k: int):
        query = preprocess(q)

        scores = []
        for single_frame_query in query:
            query_vector = encode(single_frame_query, self.tfidf_transformer)
            score = self.tags_matrix.dot(query_vector.T).toarray()
            score = [s[0] for s in score]
            scores.append(score)
        scores = np.array(scores)
        print(scores.shape)

        top_k_indices = np.argsort(scores, axis=1)[:, ::-1][:, :k]
        scores = np.take_along_axis(scores, top_k_indices, axis=1)

        return scores, top_k_indices

    def check(self, tags_matrix):
        total_elements = tags_matrix.shape[0] * tags_matrix.shape[1]
        non_zero_elements = tags_matrix.nnz
        print(f"Total elements: {total_elements}, Non-zero elements: {non_zero_elements}")
        sparsity = 1 - (non_zero_elements / total_elements)
        # A value close to 1 indicates high sparsity
        print(f"Sparsity: {sparsity:.4f}")


def preprocess(query: list[str]):
    for i, tag_query in enumerate(query):
        if isinstance(tag_query, list):
            tag_query = [tag.replace(' ', '_') for tag in tag_query]
        query[i] = [' '.join(tag_query).lower()]
        print(query[i])
    print(query)
    return query


def encode(query: list[str], transform: TfidfVectorizer):
    return transform.transform(query)
