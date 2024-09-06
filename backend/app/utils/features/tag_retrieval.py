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
        with open(os.path.join(PROJECT_ROOT, tfidf_transformer_path), 'rb') as f:
            self.tfidf_transformer = pickle.load(f)

    def __call__(self, q: list[str], k: int):

        query = preprocess(q)

        query_vector = encode(query, self.tfidf_transformer)

        scores = self.tags_matrix.dot(query_vector.T).toarray()
        top_k_indices = np.argsort(scores, axis=1)[:, ::-1][:, :k]
        scores = np.take_along_axis(scores, top_k_indices, axis=1)

        return scores, top_k_indices


def preprocess(query: list[str]):
    for i, tag_query in enumerate(query):
        if isinstance(tag_query, list):
            query[i] = ' '.join(tag_query).lower()
    return query


def encode(query: list[str], transform: TfidfVectorizer):
    return transform.transform(query)
