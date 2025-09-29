from datasets import load_dataset
import json

# Load dataset
ds = load_dataset("ShashiVish/cover-letter-dataset")

count = 0

system_message = """You are a professional career assistant and expert cover letter writer. 
Your role is to generate polished, tailored, and compelling cover letters for job seekers, one that is ready to be copy and pasted directly to a file.

When given a job description (JD) and information about the applicant (such as skills, experiences, education, and career goals), you will:
- Write in a formal yet approachable tone.
- Highlight the applicant’s most relevant skills and experiences that align with the job description.
- Emphasize impact and measurable achievements, not just responsibilities.
- Customize the cover letter for the specific role and company—avoid generic statements.
- Keep the structure professional: introduction, body, and closing.
- Use concise and engaging language that demonstrates confidence and professionalism.
- Avoid exaggerations, clichés, or repeating the resume verbatim.
- Ensure the letter is ~250–400 words unless otherwise specified.
Your goal is to make the applicant stand out while maintaining authenticity and professionalism.
"""

with open("data_set.json", "w", encoding="utf-8") as f:
    for data in ds["train"]:
        jd = {
            "Job Description": (
                f"Job Title: {data['Job Title']}, "
                f"Company: {data['Hiring Company']}, "
                f"Preferred Qualifications: {data['Preferred Qualifications']}"
            )
        }

        # Build resume string safely
        resume_str = (
            f"Name: {data['Applicant Name']}, "
            f"Experience: {data['Past Working Experience']}"
        )
        if data.get("Current Working Experience"):
            resume_str += f", Current: {data['Current Working Experience']}"
        resume_str += f", Skills: {data['Skillsets']}"
        if data.get("Qualifications"):
            resume_str += f", Qualifications: {data['Qualifications']}"

        resume = {"My resume": resume_str}

        prmpt = {
            "messages": [
                {"role": "system", "content": system_message},
                {
                    "role": "user",
                    "content": (
                        f"Generate a cover letter based on this job description: {jd}, "
                        f"and tailor it based on my resume: {resume}"
                    ),
                },
                {"role": "assistant", "content": data["Cover Letter"]},
            ]
        }

        json.dump(prmpt, f, ensure_ascii=False)
        f.write("\n")

        count += 1
        print(count)
