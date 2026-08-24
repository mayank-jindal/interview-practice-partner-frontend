import { useState } from "react";

export default function QuestionAnswer({ session, onSubmitAnswer, submitting, error }) {
  const [answerText, setAnswerText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    onSubmitAnswer(answerText);
  };

  return (
    <div className="question-answer">
      <p className="topic-label">{session.topicName}</p>
      <h2 className="question-text">{session.questionText}</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder="Type your answer here..."
          rows={12}
          disabled={submitting}
        />
        {error && <p className="status-text error">{error}</p>}
        <button type="submit" disabled={submitting || !answerText.trim()}>
          {submitting ? "Evaluating..." : "Submit Answer"}
        </button>
      </form>
    </div>
  );
}
