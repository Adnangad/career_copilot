from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from selenium.webdriver.chrome.options import Options
import time

options = Options()
options.add_argument("--headless=new")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(options=options)
wait = WebDriverWait(driver, 10)

url = "https://hiring.cafe/"

def fetch_job_links():
    links = []
    driver.get(url)
    wait.until(EC.presence_of_element_located((By.ID, "__next")))
    time.sleep(5)

    page = BeautifulSoup(driver.page_source, "html.parser")
    jobs = page.select("div.relative.xl\\:z-10")

    print(f"Found {len(jobs)} jobs")

    for job in jobs:
        link = job.select_one("a[href*='viewjob']")
        if link and link["href"]:
            links.append(link["href"])
    return links

def get_jobs_info():
    job_links = fetch_job_links()
    jobs = []
    for job_lnk in job_links:
        job_data = {}
        driver.get(job_lnk)
        time.sleep(5)

        soup = BeautifulSoup(driver.page_source, "html.parser")

        job_data["posted_time"] = (soup.select_one("span.text-xs.text-cyan-700") or {}).get_text(strip=True) if soup.select_one("span.text-xs.text-cyan-700") else None
        job_data["title"] = (soup.select_one("h2.font-extrabold") or {}).get_text(strip=True) if soup.select_one("h2.font-extrabold") else None
        job_data["company"] = (soup.select_one("span.text-xl.font-semibold") or {}).get_text(strip=True) if soup.select_one("span.text-xl.font-semibold") else None
        job_data["location"] = (soup.select_one("div.flex.space-x-2 span") or {}).get_text(strip=True) if soup.select_one("div.flex.space-x-2 span") else None

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
            apply_button = WebDriverWait(driver, 10).until(
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

jobs_data = get_jobs_info()
driver.quit()

print(jobs_data)
