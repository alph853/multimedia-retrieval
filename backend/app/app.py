import json
import asyncio
from fastapi import FastAPI, HTTPException, Request, File, UploadFile
from pydantic import BaseModel

import numpy as np
from typing import List, Dict, Any
from PIL import Image
import io

from utils import (RetrievalEngine, Assistant,
                   check_invalid_request, parse_object_retrieval_request
                   )

retrieval_engine = RetrievalEngine()
# assistant = Assistant()

app = FastAPI()


class FrameInfo(BaseModel):
    txt: str | None = None
    img: UploadFile | None = None
    ocr: str | None = None
    idx: List[int] | None = None
    tag: List[str] | None = None
    asr: str | None = None
    obj: Dict[str, Any] | None = None


class Query(BaseModel):
    search_space_idx: List[int]
    number: int
    number_of_frames: int
    frame_info: Dict[int, FrameInfo]


class Feedback(Query):
    search_space_idx: List[int]
    pos_idx: list
    neg_idx: list


@app.post("/search")
async def search(q: Query):
    if detail := check_invalid_request(q) is not None:
        raise HTTPException(status_code=400, detail=detail)

    print("User query: \n", json.dumps(q.model_dump(), indent=2))

    frame_info = parse_object_retrieval_request(q.frame_info)
    frame_number = q.number_of_frames
    k = q.number

    return retrieval_engine(frame_number, frame_info, k)


@app.post("/feedback")
async def feedback(feedback: Feedback):
    pass


@app.post('/filter')
async def filter():
    pass


# @app.get("/assistant")
# async def get_assistant(type: str, query: str):
#     if type == "tag":
#         return assistant.tag_assistant(query)
#     elif type == "prompt":
#         pass
#     else:
#         raise HTTPException(status_code=404, detail="Assistant not found")


while True:
    query = json.load(open(f'app/example.json'))
    result = asyncio.run(search(Query(**query)))
    s = input("Enter to continue, q or CTRL+C to quit: ")
    if s == 'q':
        break
