import os
import torch
from sentence_transformers import SentenceTransformer, util
from .configs import PROJECT_ROOT, sentence_transformer_model, spacy_model
import numpy as np


class TagAssistant:
    def __init__(
        self,
        tag_corpus_path=os.path.join(PROJECT_ROOT, "dict/tag/tag_corpus.txt"),
    ):
        self.model = sentence_transformer_model
        self.spacy = spacy_model
        self.tag_corpus_path = tag_corpus_path
        self.tag_corpus = self.get_tag_corpus(tag_corpus_path)
        self.tag_embeddings = self.model.encode(self.tag_corpus)

    def __call__(self, query: list[str] | str, k=10):
        """Return the tags similar to the query

        Args:
            query (str): input query 
            top_k (int, optional): top k tags. Defaults to 10.

        Returns:
            Tuple: scores (numpy), tags (list[str]) shape (n_query, k)
        """
        if isinstance(query, str):
            query, _ = spacy_model(query)

        k = max(1, min(k, len(self.tag_corpus)))

        query_embed = self.model.encode(query)
        scores = util.pytorch_cos_sim(query_embed, self.tag_embeddings).cpu().numpy()
        top_k_indices = np.argsort(scores, axis=1)[:, ::-1][:, :k]
        scores = np.take_along_axis(scores, top_k_indices, axis=1)

        tags = {}
        for idx, score in zip(top_k_indices, scores):
            for i, s in zip(idx, score):
                if s < 0.5:
                    continue
                tags[self.tag_corpus[i]] = s
        tags_list = sorted(tags.items(), key=lambda x: x[1], reverse=True)
        tags_list = [tag for tag, score in tags_list][:k]
        return tags_list


    @staticmethod
    def get_tag_corpus(tag_corpus_path):
        raw_data = []
        with open(tag_corpus_path, 'r', encoding='utf-8') as f:
            raw_data = f.readlines()
            raw_data = [word.strip() for word in raw_data]

        print(f"Tag corpus loaded: {len(raw_data)} tags")
        return raw_data


class PromptAssistant:
    pass


# tag_retrieve = TagAssistant()

# if __name__ == '__main__':
#     while True:
#         q = input("Enter query: ")
#         if q == 'exit':
#             break
#         else:
#             print(tag_retrieve(q, 10))
#             print()
