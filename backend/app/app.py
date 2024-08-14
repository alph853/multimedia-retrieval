from fastapi import FastAPI, HTTPException, Request, File, UploadFile
from pydantic import BaseModel

import numpy as np
from typing import List, Dict, Any
from PIL import Image
import io

from utils import (RetrievalEngine, Assistant,
                   validate_request, parse_object_retrieval_request
                   )

retrieval_engine = RetrievalEngine()
assistant = Assistant()

app = FastAPI()


class Query(BaseModel):
    search_space_idx: List[int]
    number: int
    number_of_frames: int
    frame_info: Dict[int, Dict[str, str | File | List[str] | None]]


class Feedback(Query):
    search_space_idx: List[int]
    pos_idx: list
    neg_idx: list


@app.POST("/search")
async def search(q: Query):
    if not validate_request(q):
        raise HTTPException(status_code=400, detail="Invalid request")

    frame_info = {int(k): v for k, v in q.frame_info.items()}
    frame_info = parse_object_retrieval_request(frame_info)
    frame_number = q.number_of_frames
    k = q.number

    return retrieval_engine(frame_number, frame_info, k)


@app.POST("/feedback")
async def feedback(feedback: Feedback):
    pass


@app.POST('/filter')
async def filter():
    pass


@app.GET("/assistant")
async def get_assistant(type: str, query: str):
    if type == "tag":
        return assistant.tag_assistant(query)
    elif type == "prompt":
        pass
    else:
        raise HTTPException(status_code=404, detail="Type not found")
