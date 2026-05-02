import os
import io
import json
import httpx
from dotenv import load_dotenv
from fastapi import UploadFile
from pypdf import PdfReader
from services.interview_service import session, call_groq

load_dotenv()


async def analyze_resume_for_interview(file: UploadFile) -> dict:
    contents = await file.read()
    reader = PdfReader(io.BytesIO(contents))
    text = "\n".join(page.extract_text() or "" for page in reader.pages)

    if not text.strip():
        return {"error": "Could not extract text from PDF."}

    role  = session.get("role")  or "Software Engineer"
    level = session.get("level") or "Mid"

    prompt = f"""You are an expert technical interviewer. Analyze this resume and generate personalized interview questions.

Target Role: {role}
Experience Level: {level}

Resume:
{text[:3000]}

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

    content = call_groq(prompt)
    content = content.replace("```json", "").replace("```", "").strip()
    return json.loads(content)


async def analyze_resume_for_leetcode(file: UploadFile) -> dict:
    contents = await file.read()
    reader = PdfReader(io.BytesIO(contents))
    text = "\n".join(page.extract_text() or "" for page in reader.pages)

    if not text.strip():
        return {"error": "Could not extract text from PDF."}

    role  = session.get("role")  or "Software Engineer"
    level = session.get("level") or "Mid"

    prompt = f"""You are a technical interview coach. Suggest LeetCode problems based on this resume.

Target Role: {role}
Experience Level: {level}

Resume:
{text[:3000]}

Return ONLY this JSON with no extra text:
{{
  "skills_detected": ["skill1", "skill2", "skill3"],
  "easy_questions": ["Problem 1", "Problem 2", "Problem 3"],
  "medium_questions": ["Problem 1", "Problem 2", "Problem 3"],
  "hard_questions": ["Problem 1", "Problem 2"]
}}"""

    content = call_groq(prompt)
    content = content.replace("```json", "").replace("```", "").strip()
    return json.loads(content)