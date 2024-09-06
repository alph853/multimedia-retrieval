import googletrans
from timeit import default_timer as timer
import spacy
import torch
from sentence_transformers import SentenceTransformer, util


SENTENCE_TRANSFORMER_MODELS = 'all-mpnet-base-v2'


class SentenceTransformerModel:
    def __init__(self, model_name: str = SENTENCE_TRANSFORMER_MODELS):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = SentenceTransformer(model_name).to(self.device)

    def encode(self, query: list[str]):
        """Return encoded query using SentenceTransformer, using 'all-mpnet-base-v2' as default.

        Args:
            query (list[str]): Query with len=(n_query, ).

        Returns:
            Tensor: Encoded query with shape (n_query, 768).
        """
        return self.model.encode(query, convert_to_tensor=True, device=self.device)


class SpacyModel:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")

    def __call__(self, text: str):
        """Process whole documents using Spacy.

        Args:
            text (str): Input text.

        Returns:
            ([Noun], [Verb]): Noun phrases and verbs.
        """
        doc = self.nlp(text)

        noun_phrases = [chunk.text for chunk in doc.noun_chunks]
        verbs = [token.lemma_ for token in doc if token.pos_ == "VERB"]
        return noun_phrases, verbs


class Translator:
    def __init__(self, from_lang: str = 'vi', to_lang: str = 'en'):
        self.__to_lang = to_lang
        self.from_lang = from_lang
        self.translator = googletrans.Translator()

    def preprocess(self, text: str):
        return text.lower()

    def __call__(self, text: str):
        """Translate text from `from_lang` to `to_lang`.

        Args:
            text (str): Input text.

        Returns:
            str: Translated text.
        """
        text = self.preprocess(text)
        return self.translator.translate(text, src=self.from_lang, dest=self.__to_lang).text



sentence_transformer_model = SentenceTransformerModel(SENTENCE_TRANSFORMER_MODELS)
spacy_model = SpacyModel()
translator = Translator()
