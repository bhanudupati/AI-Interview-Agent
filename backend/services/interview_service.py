import os
import io
import json
from groq import Groq
from dotenv import load_dotenv
from fastapi import UploadFile
from pypdf import PdfReader

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ── Session memory ──
session = {
    "role": None,
    "level": None,
    "current_question": None,
    "question_count": 0,
    "MAX_QUESTIONS": 3
}


def start_interview(role: str, level: str) -> str:
    session["role"] = role
    session["level"] = level
    session["question_count"] = 0
    session["current_question"] = None
    return generate_question()


def generate_question() -> str:
    if session["question_count"] >= session["MAX_QUESTIONS"]:
        return "Interview completed."

    prompt = f"""Generate ONE technical interview question.
Role: {session["role"]}
Level: {session["level"]}
Return only the question, nothing else."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    question = response.choices[0].message.content.strip()
    session["current_question"] = question
    session["question_count"] += 1
    return question


def evaluate_answer(answer: str) -> dict:
    prompt = f"""You are a technical interviewer. Evaluate this answer and return JSON only.

Question: {session["current_question"]}
Candidate Answer: {answer}

Return ONLY this JSON with no extra text:
{{
  "score": <number 0-10>,
  "feedback": "<short constructive feedback>",
  "correct_answer": "<ideal answer in 2-3 sentences>"
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    content = response.choices[0].message.content.strip()
    content = content.replace("```json", "").replace("```", "").strip()
    return json.loads(content)


async def analyze_resume(file: UploadFile, mode: str) -> dict:
    # Extract text from PDF
    contents = await file.read()
    reader = PdfReader(io.BytesIO(contents))
    text = "\n".join(page.extract_text() or "" for page in reader.pages)

    if not text.strip():
        return {"error": "Could not extract text from PDF. Please try a different file."}

    if mode == "interview":
        prompt = f"""You are an expert technical interviewer. Analyze this resume and generate interview questions.

Resume:
{text[:3000]}

Return ONLY this JSON:
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
    else:
        prompt = f"""You are a technical interview coach. Analyze this resume and suggest LeetCode practice problems.

Resume:
{text[:3000]}

Return ONLY this JSON:
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