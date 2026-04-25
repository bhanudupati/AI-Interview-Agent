from fastapi import APIRouter, UploadFile, File
from models.interview_model import StartRequest, AnswerRequest
from services.interview_service import start_interview, generate_question, evaluate_answer, analyze_resume

router = APIRouter()


@router.post("/start-interview")
def start(data: StartRequest):
    question = start_interview(data.role, data.level)
    return {
        "question_number": 1,
        "question": question
    }


@router.post("/submit-answer")
def submit(data: AnswerRequest):
    result = evaluate_answer(data.answer)
    return result


@router.post("/next-question")
def next_q():
    question = generate_question()
    return {"question": question}


@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    result = await analyze_resume(file, mode="interview")
    return result


@router.post("/generate-leetcode")
async def generate_leetcode(file: UploadFile = File(...)):
    result = await analyze_resume(file, mode="leetcode")
    return result