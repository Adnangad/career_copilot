import os
import requests
from dotenv import load_dotenv

load_dotenv()

xai_api = os.getenv("XAI_API_KEY")
training_file_url = os.getenv("DATASET_URL")

base_url = "https://api.x.ai/v1"

headers = {
    "Authorization": f"Bearer {xai_api}",
    "Content-Type": "application/json"
}

# 1. Create fine-tune job
payload = {
    "training_file": training_file_url,
    "model": "grok-4-fast-reasoning",
    "n_epochs": 3,
    "suffix": "cover-letter-generator"
}

response = requests.post(f"{base_url}/fine-tunes", headers=headers, json=payload)
fine_tune = response.json()
print("Fine-tune job:", fine_tune)

# 2. Poll job status
fine_tune_id = fine_tune["id"]

status = requests.get(f"{base_url}/fine-tunes/{fine_tune_id}", headers=headers)
print("Status:", status.json()["status"])
