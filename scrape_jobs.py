from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
from trafilatura import fetch_url, extract
from categorize import classify
import time
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker

load_dotenv()


db_uri = os.getenv("PSQL")

options = Options()
options.add_argument("--headless=new")
options.add_argument("--no-sandbox")
options.add_argument("--start-fullscreen")
options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(options=options)
wait = WebDriverWait(driver, 9)

actions = ActionChains(driver)

engine = create_engine(db_uri)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = automap_base()
Base.prepare(engine)
Jobs = Base.classes.jobs

url = "https://hiring.cafe/"

def fetch_job_links():
    links = []
    driver.get(url)
    driver.fullscreen_window()
    time.sleep(2)
    
    filter_button = wait.until(
    EC.element_to_be_clickable((By.XPATH, "//button[span[contains(text(),'3 months')]]"))
    )
    driver.execute_script("arguments[0].click();", filter_button)

    time.sleep(1)

    current_day = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Past 24 hours']")))
    actions.move_to_element(current_day)
    current_day.click()
    
    time.sleep(8)
    
    page = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "infinite-scroll-component__outerdiv")))
    if page:
        print("IT HAS LOADED")
    else:
        print("NAAH")
    
    page = BeautifulSoup(driver.page_source, "html.parser")
    jobs = page.select("div.relative.xl\\:z-10")

    print(f"Found {len(jobs)} jobs")

    for job in jobs:
        link = job.select_one("a[href*='viewjob']")
        if link and link["href"]:
            if link["href"] not in links:
                links.append(link["href"])
    return links

def get_jobs_info():
    job_links = fetch_job_links()
    jobs = []
    for job_lnk in job_links:
        job_data = {}
        driver.get(job_lnk)
        driver.fullscreen_window()

        soup = BeautifulSoup(driver.page_source, "html.parser")
        
        job_data["title"] = (soup.select_one("h2.font-extrabold") or {}).get_text(strip=True) if soup.select_one("h2.font-extrabold") else None
        job_data["company"] = (soup.select_one("span.text-xl.font-semibold") or {}).get_text(strip=True) if soup.select_one("span.text-xl.font-semibold") else None

        tags = [tag.get_text(strip=True) for tag in soup.select("div.flex.flex-wrap.gap-3 span")]
        job_data["tags"] = tags

        responsibilities = soup.find("span", string="Responsibilities:")
        if responsibilities:
            resp_text = responsibilities.find_next("span")
            job_data["responsibilities"] = resp_text.get_text(strip=True) if resp_text else None

        requirements = soup.find("span", string="Requirements Summary:")
        if requirements:
            req_text = requirements.find_next("span")
            job_data["requirements"] = req_text.get_text(strip=True) if req_text else None

        description = soup.select_one("article.prose")
        job_data["full_description"] = description.get_text(" ", strip=True) if description else None

        try:
            apply_button = WebDriverWait(driver, 8).until(
                EC.element_to_be_clickable((By.XPATH, "//span[text()='Apply now']"))
            )
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", apply_button)
            time.sleep(1)
            try:
                apply_button.click()
            except Exception:
                driver.execute_script("arguments[0].click();", apply_button)

            time.sleep(2)
            driver.switch_to.window(driver.window_handles[-1])        
            job_data["apply_link"] = driver.current_url if driver.current_url else None
            driver.close()
            driver.switch_to.window(driver.window_handles[0])
        except Exception:
            job_data["apply_link"] = None

        jobs.append(job_data)

    return jobs

db = SessionLocal()

try:
    jobs = get_jobs_info()
    classified_jobs = classify(jobs)
    
    
    # First checks if the job doesnt exist in the db and if not it adds them to the db
    existing = db.query(Jobs).all()
    for jb in classified_jobs:
        title = jb.get("title")
        company = jb.get("company")
        
        existing_job = db.query(Jobs).filter_by(title=title, company=company).first()
        if existing_job:
            print(f"Skipping duplicate: {title} at {company}")
            continue
        new_job = Jobs(
            title=title,
            company=company,
            description=jb.get("full_description"),
            category=jb.get("category"),
            link=jb.get("apply_link"),
            requirements=jb.get("requirements"),
            tags=",".join(jb.get("tags", [])) if jb.get("tags") else None
        )
        db.add(new_job)
    db.commit()
    
    
except Exception as e:
    print("An error occured")
    print("ERROR IS:: ", e)

finally:
    db.close()
    driver.quit()
