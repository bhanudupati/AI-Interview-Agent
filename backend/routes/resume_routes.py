from fastapi import APIRouter, UploadFile, File
from services.resume_service import analyze_resume_for_interview, analyze_resume_for_leetcode

router = APIRouter()


@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    result = await analyze_resume_for_interview(file)
    return result


@router.post("/generate-leetcode")
async def generate_leetcode(file: UploadFile = File(...)):
    result = await analyze_resume_for_leetcode(file)
    return result