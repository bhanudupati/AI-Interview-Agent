import os
import io
import json
from groq import Groq
from dotenv import load_dotenv
from fastapi import UploadFile
from pypdf import PdfReader
from services.interview_service import session

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


async def analyze_resume_for_interview(file: UploadFile) -> dict:
    contents = await file.read()
    reader = PdfReader(io.BytesIO(contents))
    text = "\n".join(page.extract_text() or "" for page in reader.pages)

    if not text.strip():
        return {"error": "Could not extract text from PDF. Please try a different file."}

    role  = session.get("role")  or "Software Engineer"
    level = session.get("level") or "Mid"

    prompt = f"""You are an expert technical interviewer. Analyze this resume and generate personalized interview questions.

Target Role: {role}
Experience Level: {level}

Resume:
{text[:3000]}

Generate questions that are:
- Relevant to the {role} role at {level} level
- Based on the specific skills and experience shown in the resume
- A mix of technical and behavioral questions

Return ONLY this JSON with no extra text:
{{
  "skills_detected": ["skill1", "skill2", "skill3"],
  "questions": [
    "Question 1?",
    "Question 2?",
    "Question 3?",
    "Question 4?",
    "Question 5?"
  ]
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    content = response.choices[0].message.content.strip()
    content = content.replace("```json", "").replace("```", "").strip()
    return json.loads(content)


async def analyze_resume_for_leetcode(file: UploadFile) -> dict:
    contents = await file.read()
    reader = PdfReader(io.BytesIO(contents))
    text = "\n".join(page.extract_text() or "" for page in reader.pages)

    if not text.strip():
        return {"error": "Could not extract text from PDF. Please try a different file."}

    role  = session.get("role")  or "Software Engineer"
    level = session.get("level") or "Mid"

    prompt = f"""You are a technical interview coach. Analyze this resume and suggest LeetCode problems to practice.

Target Role: {role}
Experience Level: {level}

Resume:
{text[:3000]}

Suggest problems that:
- Match the {role} role requirements at {level} level
- Target the weak areas or key skills needed for this role
- Are commonly asked at companies hiring for {role} positions

Return ONLY this JSON with no extra text:
{{
  "skills_detected": ["skill1", "skill2", "skill3"],
  "easy_questions": ["Problem 1", "Problem 2", "Problem 3"],
  "medium_questions": ["Problem 1", "Problem 2", "Problem 3"],
  "hard_questions": ["Problem 1", "Problem 2"]
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    content = response.choices[0].message.content.strip()
    content = content.replace("```json", "").replace("```", "").strip()
    return json.loads(content)