import os
import scipy as sp
import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from timeit import default_timer as timer
import faiss
from .configs import PROJECT_ROOT
from .utils import merge_list_results


class ObjectRetrieval:
    """
    Find top k most similar results to the query.
    
    Types of queries supported: bbox, class, tag, number, and color.
    Args:
        query (dict): A dictionary with keys 'types' and values (n_query,).
        k (int): The number of top similar results to retrieve.

    Returns:
        result (dict): A dictionary with keys 'types' and values ('scores' and 'indices') with shape (n_query, k).
    """

    def __init__(
        self,
        sparse_context_types: list = ['bbox', 'class', 'number'],
        dense_context_types: list = ['color'],
        context_paths: dict | None = None,
        tfidf_transform_paths: dict | None = None,
    ):
        self.all_context_types = sparse_context_types + dense_context_types
        self.sparse_context_types = sparse_context_types
        self.dense_context_types = dense_context_types

        self.context_paths = context_paths
        self.tfidf_transform_paths = tfidf_transform_paths

        self.context_matrix = {}
        self.tfidf_transformers = {}

        if context_paths is None:
            self.context_paths = {
                type: f"dict/obj/context/{type}_encoded.npz" for type in sparse_context_types
            }
            self.context_paths.update({
                type: f"dict/obj/context/{type}_encoded.bin" for type in dense_context_types
            })

        if tfidf_transform_paths is None:
            self.tfidf_transform_paths = {
                type: f"dict/obj/transform/{type}_tdidf_transform.pkl" for type in self.all_context_types
            }
        # type, path
        for t, p in self.context_paths.items():
            if t in sparse_context_types:
                self.context_matrix[t] = sp.sparse.load_npz(os.path.join(PROJECT_ROOT, p))
            else:
                self.context_matrix[t] = faiss.read_index(os.path.join(PROJECT_ROOT, p))
        # type
        for t in self.all_context_types:
            with open(os.path.join(PROJECT_ROOT, self.tfidf_transform_paths[t]), 'rb') as f:
                self.tfidf_transformers[t] = pickle.load(f)

    def __call__(self, query: dict[str:list[str]], k: int):
        scores_all_types = []
        indices_all_types = []

        types = query.keys()
        for t in types:
            scores, top_k_indices = self.search(query[t], k, t)
            scores_all_types.append(scores)
            indices_all_types.append(top_k_indices)

        results = merge_list_results(scores_all_types, indices_all_types, k)
        return results

    def search(self, query: list[str], k: int, type: str):
        """
        Search for the top k most similar context vectors to the query.

        Args:
            query (list[str]): Query with len=(n_query, ).
            type (str): Type of context (bbox, class, tag, number, color).

        Returns:
            tuple: A tuple containing:
                - scores (array-like): The similarity scores with shape (n_query, k).
                - top_k_indices (array-like): The indices of the top k results with shape (n_query, k).
        """
        query = self.preprocess(query)
        query_vector = self.encode(query, self.tfidf_transformers[type])

        if type in self.sparse_context_types:
            scores = self.context_matrix[type].dot(query_vector.T).toarray()
            top_k_indices = np.argsort(scores, axis=1)[:, ::-1][:, :k]
            scores = np.take_along_axis(scores, top_k_indices, axis=1)
        else:
            query_vector = query_vector.toarray().astype(np.float32)
            scores, top_k_indices = self.context_matrix[type].search(query_vector, k)

        return scores, top_k_indices

    @staticmethod
    def encode(query: list[str], transform: TfidfVectorizer):
        return transform.transform(query)

    @staticmethod
    def preprocess(query: list[str]):
        query = [q.lower() for q in query]
        return query
