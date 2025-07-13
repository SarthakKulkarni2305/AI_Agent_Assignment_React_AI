export default function AnswerDisplay({ answer }) {
  return (
    <div className="ai-bubble">
      <div className="ai-avatar">ai</div>
      <div className="ai-text">{answer}</div>
    </div>
  );
}
