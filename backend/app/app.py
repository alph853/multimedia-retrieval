from fastapi import FastAPI, HTTPException, Request, File, UploadFile
from pydantic import BaseModel

import numpy as np
from typing import List, Dict
from PIL import Image
import io

from utils.retrieval_engine import RetrievalEngine, Assistant

retreival_engine = RetrievalEngine()
assistant = Assistant()

app = FastAPI()


class Query(BaseModel):
    search_space_idx: str
    number: int

    img_query: UploadFile = File(...)
    txt_query: List[str]
    obj_query: Dict
    ocr_query: List[str]
    tag_query: List[str]
    asr_query: List[str] | None = None


class Feedback(Query):
    search_space_idx: List[int]
    pos_idx: list
    neg_idx: list


@app.POST("/search")
async def search(q: Query):
    img_bytes = await q.img_query.read()
    img_query = Image.open(io.BytesIO(img_bytes))
    pass


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
