import json
import asyncio
from fastapi import FastAPI, HTTPException, Request, File, UploadFile
from pydantic import BaseModel

import numpy as np
from typing import List, Dict, Any
from PIL import Image
import io

from utils import (RetrievalEngine,
                   check_invalid_request, parse_object_retrieval_request,
                   OCR
                   )

from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

retrieval_engine = RetrievalEngine()


class FrameInfo(BaseModel):
    txt: str | None = None
    img: Any | None = None
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


class GetAssistant(BaseModel):
    type: str
    query: str | List[str]
    num_tags: int = 15
    
    
class HistoryQuery(BaseModel):
    filename: str
    request: Query
    csv_content: list[str]


class Feedback(Query):
    search_space_idx: List[int]
    pos_idx: list
    neg_idx: list


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.post("/search")
async def search(q: Query):

    # q.frame_info[1].img = None
    # q.frame_info[1].obj = None


    if detail := check_invalid_request(q) is not None:
        raise HTTPException(status_code=400, detail=detail)

    print("User query: \n", json.dumps(q.model_dump(), indent=2, ensure_ascii=False))

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


@app.post("/assistant")
async def get_assistant(a: GetAssistant):
    if a.type == 'tag':
        return retrieval_engine.get_tag_assistant(a.query, a.num_tags)

# while True:
#     query = json.load(open(f'example.json', encoding='utf-8'))
#     result = asyncio.run(search(Query(**query)))
#     s = input("Enter to continue, q or CTRL+C to quit: ")
#     if s == 'q':
#         break

@app.get("/checkocr/{frame_id}")
async def check_ocr(frame_id: int):
    return OCR[frame_id]

@app.get("/get_frame_info/{batch_key}/{frame_key}/{file_name}")
async def get_frame_info(batch_key, frame_key, file_name):
    return retrieval_engine.get_frame_info(batch_key, frame_key, file_name)
    
@app.get("/get_output_by_timeframe/{batch_key}/{frame_key}/{timeframe}")
async def get_output_by_timeframe(batch_key, video_key, timeframe):
    return retrieval_engine.get_output_by_timeframe(batch_key, video_key, timeframe)    

@app.get("/get_history/{question_number}")
async def get_history_result_by_question(question_number: int):
    return retrieval_engine.get_history_result_by_question(question_number=question_number)

@app.post("/add_history")
async def add_to_history(history: HistoryQuery):
    return retrieval_engine.add_to_history(history.filename, history.request, history.csv_content)
    
@app.get("/get_history")
async def get_history():
    return retrieval_engine.get_history()
