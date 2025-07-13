
# 🧠 AI Planet ChatBot

This full-stack web application allows users to visually build and interact with intelligent workflows. It supports uploading documents, querying language models, and returning chat-based responses.

---

## 🚀 Features

- Upload PDF documents and extract knowledge
- Visual workflow builder using React Flow
- Chain components like: User Query → KnowledgeBase → LLM → Output
- Embedding + Vector Search using LlamaIndex + HuggingFace
- Query intelligent workflows through a chat interface
- LLM powered by Ollama

---

## 🛠️ Tech Stack

| Layer     | Tools                               |
|-----------|-------------------------------------|
| Frontend  | React.js, React Flow, Axios, PDF.js |
| Backend   | FastAPI, Ollama (LLM)               |
| NLP       | LLamaIndex, ChromaDB                |
| Storage   | SQLite                              |
| PDF Parse | PyMuPDF                             |
| Embedding | HuggingFace                         |

---

## 📁 Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── pdf_utils.py
│   │   └── qa_engine.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   └── src/
│       ├── App.js / App.css / index.js / index.css
│       └── components/
│           ├── UploadPDF.jsx
│           ├── QuestionForm.jsx
│           └── AnswerDisplay.jsx
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Backend (FastAPI + LlamaIndex)

#### Prerequisites:
- Python 3.9+
- Ollama
- pip

#### Install:
```bash
cd backend
python -m venv venv
source venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2️⃣ Frontend (React.js)

#### Prerequisites:
- Node.js + npm

#### Install:
```bash
cd frontend
npm install
npm start
```

Frontend will run at: `http://localhost:3000`  
Backend runs at: `http://localhost:8000`

---

## 🧱 Components

### 1. **User Query Component**
- Accepts query input from user

### 2. **KnowledgeBase Component**
- Upload PDFs
- Extract text using PyMuPDF
- Generate embeddings and store to vector DB

### 3. **LLM Engine Component**
- Accepts query + context
- Generates answers via Ollama

### 4. **Output Component**
- Displays chat-like answers

---

## 🧪 API Endpoints

| Method | Endpoint     | Description                |
|--------|--------------|----------------------------|
| POST   | `/upload/`   | Uploads a PDF file         |
| POST   | `/ask/`      | Sends text + question to LLM and gets answer |

---

## 📐 Architecture Diagram

```
User ──▶ UI ──▶ QueryForm ──▶ Backend
                 │               │
PDF Upload ─────▶                ▼
        Storage (FS)    ▶ PDF Text + Embeddings
                            ▼
                        LLM Index
                            ▼
                       LLM (OpenAI)
                            ▼
                Final Answer ➡ Output UI
```

---

## 👨‍💻 Author

**Sarthak Kulkarni**  
Project built for **AI Planet** Internship Assignment
