# This module defines the various api endpoints

from fastapi import FastAPI, Depends, UploadFile, Response, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import os
from upstash_redis import Redis
from uuid import uuid4
import io
from PyPDF2 import PdfReader
import requests
from math import ceil
from typing import List, Optional
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://career-copilot-9qfry53c5-adnangads-projects.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

llm_api = os.getenv("LLM_API")

redis_url = os.getenv("UPSTASH_REDIS_REST_URL")
redis_token = os.getenv("UPSTASH_REDIS_REST_TOKEN")
redis = Redis(url=redis_url, token=redis_token)

db_uri = os.getenv('psql')
engine = create_engine(db_uri)
Base = automap_base()
Base.prepare(engine)
Jobs = Base.classes.jobs

def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()

def save_resume(file, thread_id):
    pdf_stream = io.BytesIO(file)
    pdf_reader = PdfReader(pdf_stream)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() + "\n"
    key = f"resume:{thread_id}"
    redis.set(key, text.strip(), ex=3600*24)

def delete_resume(thread_id):
    key = f"resume:{thread_id}"
    resume = redis.get(key)
    if not resume:
        return None
    else:
        redis.delete(key)
        return "Success"


@app.get("/jobs")
def root(page: int = 1, page_size: int = 10, filters: Optional[List[str]] = Query(None), db: Session = Depends(get_db)):
    try:
        query = db.query(Jobs)
        if filters:
            query = query.filter(Jobs.category.in_(filters))
        total_jobs = query.count()
        total_pages = ceil(total_jobs / page_size) if total_jobs else 1
        data = (
            query.offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )
        has_next = page < total_pages
        has_prev = page > 1
        return {"total_pages": total_pages, "jobs": data, "has_next": has_next, "has_prev": has_prev}
    except Exception as e:
        print("AN ERROR OCCURED:: ", e)
        return {"status": "Error", "message": "Unable to fetch data at this time"}

@app.post("/upload_resume")
async def upload_res(file: UploadFile, response: Response, request: Request):
    try:
        existing_thread = request.cookies.get("session_id")
        if existing_thread:
            res = delete_resume(existing_thread)
            print("RES IS:: ", res)
        thread_id = str(uuid4())
        file_dat = await file.read()
        save_resume(file_dat, thread_id)
        response.set_cookie(
            key="session_id",
            value=thread_id,
            max_age=3600 * 24,
            httponly=True,
            secure=True,
            samesite="None"
        )
        return {"status": 200, "message": "Resume uploaded successfully, kindly note that your resume is only stored for 1 day"}
    except Exception as e:
        print("ERROR IS:: ", e)
        return {'status': 500, 'message': 'Unable to upload resume'}

@app.get("/analyse_chances")
async def analyse_chance(jobId: int, request: Request, db: Session = Depends(get_db)):
    try:
        print("ACCESSED")
        thread_id = request.cookies.get("session_id")
        print(request.cookies)
        job = db.query(Jobs).filter_by(id=jobId).first()
        if not job:
            return {"status": 404, "message": "Job not found"}
        if thread_id is None:
            return {"status": 403, "message": "You are yet to include your resume"}
        analyse_url = llm_api + f"analyze?thread_id={thread_id}&jobId={jobId}"
        resp = requests.post(analyse_url)
        data = resp.json()
        if data["status"] == 200:
            return {"status": 200, "message": "Success", "analysis": data["analysis"]}
        else:
            raise Exception
    except Exception as e:
        print("ERROR IS:: ", e)
        return {'status': 500, 'message': 'Unable to perform analysis at this time'}

@app.get("/generate_cover_letter")
async def generate_cv(jobId: int, request: Request, db: Session = Depends(get_db)):
    try:
        thread_id = request.cookies.get("session_id")
        job = db.query(Jobs).filter_by(id=jobId).first()
        if not job:
            return {"status": 404, "message": "Job not found"}
        
        if thread_id is None:
            return {"status": 403, "message": "You are yet to include your resume"}
        cv_url = llm_api + f"generate_cover_letter?thread_id={thread_id}&jobId={jobId}"
        resp = requests.post(cv_url)
        data = resp.json()
        if data["status"] == 200:
            return {"status": 200, "message": "Success", "analysis": data["letter"]}
        else:
            raise Exception
    except Exception as e:
        print("ERROR IS:: ", e)
        return {'status': 500, 'message': 'Unable'}
        