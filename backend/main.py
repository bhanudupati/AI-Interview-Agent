from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.interview_routes import router as interview_router
from routes.resume_routes import router as resume_router

app = FastAPI(title="AI Interview Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interview_router)
app.include_router(resume_router)

@app.get("/")
def root():
    return {"message": "AI Interview Agent API is running"}