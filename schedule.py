# This module is used to fetch all upcoming epl schedules

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from trafilatura import fetch_url, extract
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 6)

def accept_cookies():
    try:
        frame = wait.until(
            EC.presence_of_element_located((By.ID, "sp_message_container_1372285"))
            )
        driver.switch_to.frame(frame)

        continue_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Continue')]"))
        )

        continue_button.click()

        driver.switch_to.default_content()
        print("Cookie banner closed")
    except:
        print("No cookie popup detected")


def fetch_matches():
    url = "https://www.goal.com/en-ke/premier-league/fixtures-results/2kwbbcootiqqgmrzs6o5inle5"
    try:
        driver.get(url)
        print("Here")
        accept_cookies()
        wait.until(EC.presence_of_element_located((By.ID, "__next")))
        page = BeautifulSoup(driver.page_source, "html.parser")
        for match_day in page.select("div.match-day_match-day__abKub"):
            date_span = match_day.select_one("span.heading_name__Iq9xg")
            match_date = date_span.text.strip() if date_span else "Unknown date"

            # Extract matches within this day
            matches = match_day.select("div.fco-match-row--fixture")
            for match in matches:
                # Time
                time_tag = match.select_one("time")
                match_time = time_tag.text.strip() if time_tag else "Unknown time"
        
                # Teams
                team_a = match.select_one("div.fco-match-team-and-score__team-a div.fco-team-name.fco-long-name").text.strip()
                team_b = match.select_one("div.fco-match-team-and-score__team-b div.fco-team-name.fco-long-name").text.strip()
                
                
                print(f"{match_date} | {match_time} | {team_a} vs {team_b}")
    except Exception as e:
        print("ERROR is:: ", e)
    finally:
        driver.quit()

fetch_matches()