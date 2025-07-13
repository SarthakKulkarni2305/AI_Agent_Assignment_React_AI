import uuid
import os
import shutil
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.database import SessionLocal, Document
from app.qa_engine import build_index_and_ask_question

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploaded_pdfs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class AskRequest(BaseModel):
    question: str
    text: str

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    db = SessionLocal()
    db_doc = Document(filename=unique_filename)
    db.add(db_doc)
    db.commit()
    db.close()
    return {"filename": unique_filename}

@app.post("/ask/")
async def ask_question(data: AskRequest):
    answer = build_index_and_ask_question(data.text, data.question)
    return {"answer": answer}
