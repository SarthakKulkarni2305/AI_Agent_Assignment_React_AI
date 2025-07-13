import React, { useState } from 'react';
import axios from 'axios';

export default function QuestionForm({ pdfText, onAnswer }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/ask/", {
        question,
        text: pdfText,
      }, {
        timeout: 35000,
      });
      onAnswer(question, res.data.answer || "⚠️ No answer returned.");
    } catch (err) {
      console.error("Error asking question:", err);
      onAnswer(question, "❌ Something went wrong. Try again or refresh.");
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  return (
    <div className="question-form">
      <input
        className="question-input"
        type="text"
        placeholder="Send a message..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        disabled={loading}
      />
      <button className="send-button" onClick={askQuestion} disabled={loading}>
        {loading ? "..." : "➤"}
      </button>
    </div>
  );
}
