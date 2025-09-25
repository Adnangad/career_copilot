# This module contains the db models/tables definition and also creates the table

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, Text, Enum, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()


db_uri = os.getenv("psql")

if db_uri is None:
    print("Not found")

Declarative_base = declarative_base()


class Jobs(Declarative_base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, unique=True)
    title = Column(String)
    company = Column(String)
    requirements = Column(Text, nullable=True)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    tags = Column(String, nullable=True)
    link = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (
        UniqueConstraint("title", "company", name="uix_title_company"),
    )
    
    def __repr__(self):
            return f"<Job(id={self.id}, title='{self.title}', company='{self.company}')>"
    
try:
    engine = create_engine(db_uri)
    Declarative_base.metadata.create_all(engine)
except Exception as e:
    print("ERROR WHEN CREATING TABLE:: ", e)
