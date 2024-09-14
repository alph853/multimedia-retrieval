import copy
import random
import numpy as np
import json
from .retrieval_engine import RetrievalEngine

frame_number = 3
frame_info = {
    1: {
        "txt": "photo of a boy walks to school",
        "img": None,
        "ocr": None,
        "idx": None,
        "tag": ["school", "sad", "tired", "bicycle", "gate"],
        "asr": "cứu tui dới",
        # "obj": {
        #     "canvasSize": {"h": 30, "w": 30},
        #     "dragObject": [
        #         {
        #             "class": "bicycle",
        #             "position": [
        #                 {"xTop": 1, "yTop": 5, "xBot": 0.25, "yBot": 2.33},
        #                 {"xTop": 4, "yTop": 15, "xBot": 3.3, "yBot": 12}
        #             ]
        #         },
        #         {
        #             "class": "person",
        #             "position": [
        #                 {"xTop": 1, "yTop": 5, "xBot": 0.25, "yBot": 2.33},
        #                 {"xTop": 4, "yTop": 15, "xBot": 3.3, "yBot": 12},
        #                 {"xTop": 14, "yTop": 15, "xBot": 13.3, "yBot": 12},
        #                 {"xTop": 16, "yTop": 15, "xBot": 13.3, "yBot": 12}
        #             ]
        #         }
        #     ],
        #     "drawColor": [
        #         {"color": "blue", "position": []},
        #         {"color": "red", "position": []}
        #     ]
        # }
        "obj": None,
    },
    2: {
        "txt": "but the school is on fire",
        "img": None,
        "ocr": None,
        "idx": None,
        "tag": None,
        "asr": None,
        "obj": None,
    },
    3: {
        "txt": "so he is very happy",
        "img": None,
        "ocr": None,
        "idx": None,
        "tag": None,
        "asr": None,
        "obj": None,
    }
}

k = 10
retrieval_engine = RetrievalEngine()

results = retrieval_engine(frame_number, frame_info, k)
