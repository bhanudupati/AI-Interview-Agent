from pydantic import BaseModel

class StartRequest(BaseModel):
    role: str
    level: str

class AnswerRequest(BaseModel):
    answer: str