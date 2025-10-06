"""# This moduke opens a connection with the db and creates the tables along with their columns

from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

# loads the env variables
load_dotenv()

db_uri = os.getenv("psql")

if db_uri is None:
    print("Not found")

try:"""
    