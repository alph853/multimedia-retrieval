import spacy
import tqdm
from timeit import default_timer as timer
# Load English tokenizer, tagger, parser and NER
nlp = spacy.load("en_core_web_sm")

while True:
    # Process whole documents
    text = input("Enter text: ")

    s = timer()
    doc = nlp(text)
    e = timer()
    print(f"Time taken to process: {e-s} seconds")
    # Analyze syntax
    print("Noun phrases:", [chunk.text for chunk in doc.noun_chunks])
    print("Verbs:", [token.lemma_ for token in doc if token.pos_ == "VERB"])

    # Find named entities, phrases and concepts
    for entity in doc.ents:
        print(entity.text, entity.label_)
