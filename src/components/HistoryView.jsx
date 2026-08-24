export default function HistoryView({ history, loading, error }) {
  if (loading) return <p className="status-text">Loading history...</p>;
  if (error) return <p className="status-text error">Failed to load history: {error}</p>;
  if (history.length === 0) return <p className="status-text">No completed sessions yet.</p>;

  return (
    <div className="history-view">
      <h2>Session History</h2>
      {history.map((item) => (
        <div key={item.sessionId} className="history-item">
          <div className="history-header">
            <span className="topic-label">{item.topicName}</span>
            <span className="history-date">
              {new Date(item.completedAt).toLocaleDateString()}
            </span>
          </div>
          <p className="history-question">{item.questionText}</p>

          <details>
            <summary>View your answer and feedback</summary>
            <div className="history-detail">
              <h4>Your Answer</h4>
              <p>{item.answerText}</p>
              <h4>Feedback</h4>
              <p>{item.feedbackText}</p>
              <div className="history-scores">
                <span>Completeness: {item.completenessScore}/5</span>
                <span>Clarity: {item.communicationClarityScore}/5</span>
                <span>Trade-offs: {item.coveredTradeoffs ? "✓" : "✗"}</span>
                <span>Edge cases: {item.coveredEdgeCases ? "✓" : "✗"}</span>
              </div>
            </div>
          </details>
        </div>
      ))}
    </div>
  );
}
