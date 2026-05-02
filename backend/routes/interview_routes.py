from fastapi import APIRouter
from models.interview_model import StartRequest, AnswerRequest
from services.interview_service import start_interview, generate_question, evaluate_answer

router = APIRouter()

@router.post("/start-interview")
def start(data: StartRequest):
    question = start_interview(data.role, data.level)
    return {"question_number": 1, "question": question}

@router.post("/submit-answer")
def submit(data: AnswerRequest):
    result = evaluate_answer(data.answer)
    return result

@router.post("/next-question")
def next_q():
    question = generate_question()
    return {"question": question}