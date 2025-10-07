# Career Copilot — Backend API Service

This microservice is part of the Career Copilot ecosystem — an AI-powered platform that helps job seekers discover and analyze opportunities.<br>

The Backend API Service acts as the bridge between the frontend, the database, and the AI model. It powers job retrieval, resume uploads, AI-driven job analysis, and cover letter generation — all through RESTful FastAPI endpoints.<br>

## Overview

This branch contains code that:<br>

-Fetches job listings from the Neon PostgreSQL database with optional filters<br>

-Handles resume uploads, which are stored temporarily (24 hours) in Upstash Redis<br>

-Issues a session cookie that uniquely identifies a user’s resume<br>

-Provides endpoints that call the hosted LLM backend to:

--Analyze a user’s job-fit chances<br>

--Generate tailored cover letters<br>

--Implements Redis caching for frequently accessed queries to optimize performance<br>

This service connects the frontend and other Career Copilot services (e.g. scraper, LLM backend).<br>

## Tech Stack
| Purpose | Technology |
| :------- | :------: |
| Web Framework | Fastapi |
| DB | Neon PostgresQL |
| Cache and temp storage  | Upstash Redis|
| Language	|  Python 3.10+

## Project Structure
career_copilot/
│
├── main.py                 # FastAPI entry point <br>
├── requirements.txt <br>
└── README.md<br>

## Environment Variables

Create a .env file in the project root with the following keys:<br>

psql=postgresql://<user>:<password>@<host>/<db_name>
UPSTASH_REDIS_REST_URL=your upstash redis url<br>
UPSTASH_REDIS_REST_TOKEN=your given token<br>
UPSTASH_REDIS=your data given to you by upstash to connect to the db<br>
LLM_API=the url to your hosted llm model<br>


## Setup & Usage
1 Clone the Repository<br>
git clone https://github.com/<your-username>/career_copilot.git<br>
cd career_copilot<br>
git checkout -b backend_apis<br>

2 Create and Activate a Virtual Environment<br>
python -m venv venv<br>
source venv/bin/activate  # Linux / Mac<br>
venv\Scripts\activate     # Windows<br>

3 Install Dependencies<br>
pip install -r requirements.txt<br>

4 Set Up Environment Variables<br>

Copy .env.example → .env and fill in the required values.<br>

5 Run the Server<br>
python fastapi dev main.py<br>


The API will start on http://localhost:8000 (or your configured port).

## Core Endpoints
🗂️ /jobs<br>
Fetches all jobs or filtered results from the database.<br>

📤 /upload_resume<br>

Uploads a user’s resume.

The resume is stored temporarily in Upstash Redis for 24 hours.<br>


🧠 /analyse_chances<br>

Analyzes a user’s chances of getting a selected job.<br>

The backend retrieves the user’s resume from Redis using their session_id cookie.

It sends the resume and job data to the hosted LLM backend for analysis.<br>

📝 /generate_cover_letter<br>

Generates a personalized cover letter for a selected job.<br>

Uses the stored resume and job details<br>

Calls the hosted LLM backend<br>

Returns an AI-generated cover letter text<br>

## ⚙️ How It Works
The user interacts with the frontend → requests job data from FastAPI.<br>

Resume uploads are cached in Redis and linked via session cookies.<br>

When analysis or cover letter endpoints are hit, FastAPI sends data to the hosted LLM backend.<br>

LLM responses are sent back to the frontend for display.<br>

Redis caching minimizes redundant database queries.<br>

## Features Summary

-Job retrieval with filters<br>
-Resume upload with session tracking<br>
-AI-powered job analysis<br>
-AI cover letter generation<br>
-Redis-based caching & temporary storage<br>
-FastAPI for high-performance async API handling<br>

## Future Improvements

Authentication for persistent user accounts<br>

Improved error handling & logging<br>

Rate limiting for LLM requests<br>

Background tasks for async processing<br>

Docker & CI/CD pipeline

## Author

Adnan Obuya<br>
🌐 Portfolio: https://portfolio-front-mhuj.onrender.com/ <br>
🪪 License: MIT License © 2025 Adnan Obuya <br>