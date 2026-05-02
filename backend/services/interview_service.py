import os
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"

session = {
    "role": None,
    "level": None,
    "current_question": None,
    "question_count": 0,
    "MAX_QUESTIONS": 3
}


def call_groq(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    body = {
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}]
    }
    response = httpx.post(GROQ_URL, headers=headers, json=body, timeout=30)
    return response.json()["choices"][0]["message"]["content"].strip()


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

    question = call_groq(prompt)
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

    content = call_groq(prompt)
    content = content.replace("```json", "").replace("```", "").strip()
    return json.loads(content)