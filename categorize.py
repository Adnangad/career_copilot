# This module categorizes the jobs into various departments

import re
import requests
from dotenv import load_dotenv
import json
import os

load_dotenv()

llm_url = os.getenv("LLM_API")

JOB_KEYWORDS = {
    "engineering": [
        "mechanical engineer", "civil engineer", "electrical engineer", "aerospace engineer",
        "biomedical engineer", "chemical engineer", "structural engineer", "industrial engineer",
        "environmental engineer", "manufacturing engineer", "automotive engineer"
    ],
    "software_and_technology": [
        "software engineer", "software developer", "frontend developer", "backend developer",
        "full stack developer", "mobile developer", "devops engineer", "qa engineer",
        "data engineer", "machine learning engineer", "ai engineer", "cloud engineer",
        "site reliability engineer", "cybersecurity engineer", "blockchain developer", "developer"
    ],
    "business_operations": [
        "project manager", "program manager", "operations manager", "business analyst",
        "hr manager", "recruiter", "finance analyst", "accountant",
        "customer success manager", "office manager", "executive assistant", "strategy analyst"
    ],
    "food_and_hospitality": [
        "chef", "cook", "barista", "waiter", "waitress", "bartender", "kitchen staff",
        "hotel manager", "housekeeper", "concierge", "catering staff", "line cook"
    ],
    "healthcare": [
        "doctor", "nurse", "surgeon", "pharmacist", "therapist", "psychologist", "psychiatrist",
        "medical assistant", "paramedic", "dentist", "optometrist", "veterinarian",
        "radiologist", "lab technician", "occupational therapist", "medical", "clinical"
    ],
    "education_and_training": [
        "teacher", "professor", "lecturer", "tutor", "trainer", "curriculum designer",
        "instructional designer", "teaching assistant", "school principal", "education coordinator"
    ],
    "creative_design_media": [
        "graphic designer", "ui designer", "ux designer", "ux researcher", "product designer",
        "illustrator", "copywriter", "content writer", "editor", "videographer", "photographer",
        "art director", "creative director", "brand designer"
    ],
    "sales_and_marketing": [
        "sales manager", "account executive", "business development representative",
        "sales associate", "inside sales", "outside sales", "digital marketing manager",
        "seo specialist", "marketing manager", "social media manager", "content marketer",
        "brand manager", "pr manager"
    ],
    "legal_and_compliance": [
        "lawyer", "attorney", "paralegal", "legal assistant", "compliance officer",
        "contract manager", "legal counsel", "corporate counsel", "judge", "litigation specialist"
    ],
    "skilled_trades_or_labor": [
        "electrician", "plumber", "carpenter", "welder", "mechanic", "truck driver",
        "construction worker", "painter", "mason", "roofer", "hvac technician",
        "maintenance worker", "machine operator"
    ],
    "science_and_research": [
        "research scientist", "biologist", "chemist", "physicist", "lab assistant",
        "research assistant", "research fellow", "data scientist", "clinical researcher",
        "epidemiologist"
    ],
    "government_and_public_sector": [
        "policy analyst", "civil servant", "government officer", "police officer", "firefighter",
        "military officer", "emergency responder", "customs officer", "immigration officer",
        "corrections officer", "public health officer"
    ],
    "finance_and_banking": [
        "investment banker", "financial analyst", "bank teller", "loan officer",
        "accountant", "auditor", "tax advisor", "portfolio manager", "actuary",
        "financial advisor", "fund manager", "risk analyst"
    ],
    "retail_and_customerservice": [
        "cashier", "retail associate", "store manager", "sales associate",
        "customer service representative", "call center agent", "shop assistant",
        "merchandiser", "personal shopper", "retail supervisor"
    ],
    "logistics_and_supply_chain": [
        "logistics coordinator", "supply chain analyst", "warehouse worker", "delivery driver",
        "inventory manager", "shipping coordinator", "procurement manager",
        "distribution manager", "operations coordinator"
    ]
}

def get_llm_categorizers(jobs: list):
    print("LLM STARTED")
    job_titles = []
    for job in jobs:
        title = job["title"]
        job_titles.append(title.lower())
    print("LLM_API exists:", bool(os.getenv("LLM_API")))
    response = requests.post(llm_url, json={"job_titles": job_titles})
    print("RESPONSE IS:: ", response)
    if response.status_code == 200:
        data = response.json()
        categories = json.loads(data["categories"]) 
        return categories
    else:
        return JOB_KEYWORDS

def classify(jobs: list):
    try:
        categorizer = get_llm_categorizers(jobs)
        print("TYPE CATEGORIZER IS:: ", type(categorizer))
        for job in jobs:
            title = job["title"]
            title = title.lower()
            print(title)
            for category, keywords in categorizer.items():
                for word in keywords:
                    if re.search(rf"\b{re.escape(word)}\b", title):
                        print("MATCH FOUND")
                        job["category"] = category
            if job.get("category") is None:
                job["category"] = "Other"
        return jobs
    except Exception as e:
        print("An error has occured in classify:: ", e)
        raise e