import React, { useState } from "react";
import UploadPDF from "./components/UploadPDF";
import QuestionForm from "./components/QuestionForm";
import AnswerDisplay from "./components/AnswerDisplay";
import "./App.css";

function App() {
  const [pdfData, setPdfData] = useState({ text: "", filename: null });
  const [answer, setAnswer] = useState("");
  const [questionHistory, setQuestionHistory] = useState([]);

  const handleNewAnswer = (question, answerText) => {
    setAnswer(answerText);
    setQuestionHistory([...questionHistory, { question, answer: answerText }]);
  };

  return (
    <div className="app-container">
      <div className="header">
        <div className="logo-wrapper">
          <img src="/ai_planet_logo.png" alt="Logo" className="logo" />
          <div className="title-group">
            <h2 className="title">planet</h2>
            <span className="subtitle">formerly DPhi</span>
          </div>
        </div>
        <div className="upload-section">
          {pdfData.filename && (
            <span className="filename">{pdfData.filename}</span>
          )}
          <UploadPDF onUploadSuccess={setPdfData} />
        </div>
      </div>

      <div className="chat-box">
        {questionHistory.map((entry, idx) => (
          <div key={idx}>
            <div className="chat-message user">{entry.question}</div>
            <div className="chat-message ai">
              <AnswerDisplay answer={entry.answer} />
            </div>
          </div>
        ))}
      </div>

      {pdfData.text && (
        <div className="input-wrapper">
          <QuestionForm pdfText={pdfData.text} onAnswer={handleNewAnswer} />
        </div>
      )}
    </div>
  );
}

export default App;
