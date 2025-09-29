from fastapi import FastAPI, UploadFile, Response
from uuid import uuid4
from upstash_redis import Redis
from os import getenv
from dotenv import load_dotenv
import requests
import io
from PyPDF2 import PdfReader

load_dotenv()

redis_url = getenv("UPSTASH_REDIS_REST_URL")
redis_token = getenv("UPSTASH_REDIS_REST_TOKEN")
db_url = getenv("psql")

# FastAPI app setup
app = FastAPI()

# Redis setup
redis = Redis(url=redis_url, token=redis_token)

def save_file(file, thread_id):
    pdf_stream = io.BytesIO(file)
    reader = PdfReader(pdf_stream)
    text=""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    key = f"resume:{thread_id}"
    redis.set(key, text.strip(), ex=3600*24)

@app.post("/upload")
async def upload_file(file: UploadFile, jobId: int, response: Response):
    try:
        thread_id = str(uuid4())
        print(thread_id)
        file_data = await file.read()
        print("FILE DATA IS:: ", file_data)
        save_file(file_data, thread_id)
        response.set_cookie(
            key="session_id",
            value=thread_id,
            max_age=3600 * 24,
            httponly=True,
            secure=True,
            samesite="Lax"
        )
        return {"status": 200, "message": "Received file"}
    except Exception as e:
        print("ERROR IS:: ", e)
        return {'status': 500, 'message': 'Unable'}