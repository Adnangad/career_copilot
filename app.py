# This module defines the various api endpoints

from fastapi import FastAPI, Depends
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import os

load_dotenv()

app = FastAPI()

db_uri = os.getenv('psql')

engine = create_engine(db_uri)

Base = automap_base()

Base.prepare(engine, reflect=True)

Jobs = Base.classes.jobs

def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()




@app.get("/jobs")
def root(page: int = 1, page_size: int = 10, db: Session = Depends(get_db)):
    try:
        data = db.query(Jobs).offset((page - 1) * page_size).limit(page_size).all()
        return data
    except Exception as e:
        print("AN ERROR OCCURED:: ", e)
        return {"status": "Error", "message": "Unable to fetch data at this time"}