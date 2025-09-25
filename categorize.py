# This module categorizes the jobs into various departments

import re

JOB_KEYWORDS = {
    "Engineering": [
        "mechanical engineer", "civil engineer", "electrical engineer", "aerospace engineer",
        "biomedical engineer", "chemical engineer", "structural engineer", "industrial engineer",
        "environmental engineer", "manufacturing engineer", "automotive engineer"
    ],
    "Software / Technology": [
        "software engineer", "software developer", "frontend developer", "backend developer",
        "full stack developer", "mobile developer", "devops engineer", "qa engineer",
        "data engineer", "machine learning engineer", "ai engineer", "cloud engineer",
        "site reliability engineer", "cybersecurity engineer", "blockchain developer", "developer"
    ],
    "Business Operations": [
        "project manager", "program manager", "operations manager", "business analyst",
        "hr manager", "recruiter", "finance analyst", "accountant",
        "customer success manager", "office manager", "executive assistant", "strategy analyst"
    ],
    "Food & Hospitality": [
        "chef", "cook", "barista", "waiter", "waitress", "bartender", "kitchen staff",
        "hotel manager", "housekeeper", "concierge", "catering staff", "line cook"
    ],
    "Healthcare": [
        "doctor", "nurse", "surgeon", "pharmacist", "therapist", "psychologist", "psychiatrist",
        "medical assistant", "paramedic", "dentist", "optometrist", "veterinarian",
        "radiologist", "lab technician", "occupational therapist", "medical", "clinical"
    ],
    "Education & Training": [
        "teacher", "professor", "lecturer", "tutor", "trainer", "curriculum designer",
        "instructional designer", "teaching assistant", "school principal", "education coordinator"
    ],
    "Creative / Design / Media": [
        "graphic designer", "ui designer", "ux designer", "ux researcher", "product designer",
        "illustrator", "copywriter", "content writer", "editor", "videographer", "photographer",
        "art director", "creative director", "brand designer"
    ],
    "Sales & Marketing": [
        "sales manager", "account executive", "business development representative",
        "sales associate", "inside sales", "outside sales", "digital marketing manager",
        "seo specialist", "marketing manager", "social media manager", "content marketer",
        "brand manager", "pr manager"
    ],
    "Legal & Compliance": [
        "lawyer", "attorney", "paralegal", "legal assistant", "compliance officer",
        "contract manager", "legal counsel", "corporate counsel", "judge", "litigation specialist"
    ],
    "Skilled Trades / Labor": [
        "electrician", "plumber", "carpenter", "welder", "mechanic", "truck driver",
        "construction worker", "painter", "mason", "roofer", "hvac technician",
        "maintenance worker", "machine operator"
    ],
    "Science & Research": [
        "research scientist", "biologist", "chemist", "physicist", "lab assistant",
        "research assistant", "research fellow", "data scientist", "clinical researcher",
        "epidemiologist"
    ],
    "Government & Public Sector": [
        "policy analyst", "civil servant", "government officer", "police officer", "firefighter",
        "military officer", "emergency responder", "customs officer", "immigration officer",
        "corrections officer", "public health officer"
    ],
    "Finance & Banking": [
        "investment banker", "financial analyst", "bank teller", "loan officer",
        "accountant", "auditor", "tax advisor", "portfolio manager", "actuary",
        "financial advisor", "fund manager", "risk analyst"
    ],
    "Retail & Customer Service": [
        "cashier", "retail associate", "store manager", "sales associate",
        "customer service representative", "call center agent", "shop assistant",
        "merchandiser", "personal shopper", "retail supervisor"
    ],
    "Logistics & Supply Chain": [
        "logistics coordinator", "supply chain analyst", "warehouse worker", "delivery driver",
        "inventory manager", "shipping coordinator", "procurement manager",
        "distribution manager", "operations coordinator"
    ]
}

def classify(jobs: list):
    try:
        for job in jobs:
            title = job["title"]
            title = title.lower()
            print(title)
            for category, keywords in JOB_KEYWORDS.items():
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