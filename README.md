# Career Copilot — Job Scraper Service  

This microservice is part of the Career Copilot ecosystem — an AI-powered platform that helps job seekers discover and analyze opportunities.  

The Job Scraper Service automates the process of fetching job listings from the web, categorizing them using AI, and storing them in a centralized database for downstream analysis and visualization.  


## Overview  

This branch contains code that:  
-Scrapes job listings from Hiring Caffee using Selenium and BeautifulSoup  
-Categorizes scraped jobs using the Grok AI model  
-Stores structured job data into a Neon PostgreSQL database  

This service runs independently as part of a microservice architecture, where other services handle AI analysis, resume matching, and cover letter generation.  

## Tech Stack  
| Purpose | Technology |
| :------- | :------: |
| Web Scraping | Selenium, BeautifulSoup |
| AI Categorization | Grok AI Model |
| Database  | Neon PostgresQL
| Language	|  Python 3.10+

📁 Project Structure
career-copilot/
│
├── main.py                # Entry point for scraping and categorization
├── scrape_jobs.py    # Contains code thatscrapes the jobs and stores them in the db
│── categorizer.py     # Contains code that categorizes the jobs
│
├── models.py          # Job schema definitions
│
├── requirements.txt
└── README.md

## Environment Variables

Create a .env file in the project root with the following keys:<br>
PSQL=postgresql//<user>:<password>@<host>/<db_name> <br>
LLM_API=your hosted llm backend api <br>


## Setup & Usage
1 Clone the Repository<br>
git clone https://github.com/<your-username>/career_copilot.git <br>
cd career_copilot <br>

2 Create and Activate a Virtual Environment <br>
python -m venv venv<br>
source venv/bin/activate  # Linux / Mac<br>
venv\Scripts\activate     # Windows<br>

3 Install Dependencies<br>
pip install -r requirements.txt<br>

4 Set Up Environment Variables<br>
Copy .env.example → .env and fill in the required keys.<br>

5 Run the Scraper<br>
python scrape_jobs.py<br>


The script will automatically connect to Neon, scrape jobs from Hiring Caffee, categorize them, and persist them to the database.

## How It Works<br>
graph TD
    A[Hiring Caffee Website] --> B[Selenium Scraper]
    B --> C[BeautifulSoup Parser]
    C --> D[Your hosted LLM Categorizer]
    D --> E[Neon PostgreSQL Database]


Selenium automates browser navigation and collects job listings.<br>

BeautifulSoup extracts job details like title, company, location, and description.<br>

A requet is made to the llm model which  assigns each job to a relevant category or domain (e.g., “Frontend Development”, “Data Science”).<br>

Results are stored in Neon DB for later retrieval by other Career Copilot services.<br>

## Future Improvements

Multi-source scraping (LinkedIn, Wellfound, RemoteOK)<br>

Automatic duplicate filtering<br>

Async scraping for faster performance<br>

Docker containerization<br>

## Author
Adnan Obuya <br>
Portfolio: https://portfolio-front-mhuj.onrender.com/ <br>
License
MIT License © 2025 Adnan Obuya <br>