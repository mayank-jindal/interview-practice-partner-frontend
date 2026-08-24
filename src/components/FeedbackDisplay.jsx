export default function FeedbackDisplay({ feedback, onPracticeAgain }) {
  return (
    <div className="feedback-display">
      <h2>Feedback</h2>

      <div className="score-grid">
        <div className="score-card">
          <span className="score-label">Completeness</span>
          <span className="score-value">{feedback.completenessScore}/5</span>
        </div>
        <div className="score-card">
          <span className="score-label">Communication Clarity</span>
          <span className="score-value">{feedback.communicationClarityScore}/5</span>
        </div>
        <div className={`score-card ${feedback.coveredTradeoffs ? "covered" : "missed"}`}>
          <span className="score-label">Trade-offs</span>
          <span className="score-value">{feedback.coveredTradeoffs ? "Covered" : "Missed"}</span>
        </div>
        <div className={`score-card ${feedback.coveredEdgeCases ? "covered" : "missed"}`}>
          <span className="score-label">Edge Cases</span>
          <span className="score-value">{feedback.coveredEdgeCases ? "Covered" : "Missed"}</span>
        </div>
      </div>

      <div className="feedback-text">
        <h3>Critique</h3>
        <p>{feedback.feedbackText}</p>
      </div>

      <button onClick={onPracticeAgain}>Practice Another Topic</button>
    </div>
  );
}
