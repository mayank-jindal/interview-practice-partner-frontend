import { useState, useEffect } from "react";
import { fetchTopics, startSession, submitAnswer, fetchHistory } from "./api";
import TopicSelector from "./components/TopicSelector";
import QuestionAnswer from "./components/QuestionAnswer";
import FeedbackDisplay from "./components/FeedbackDisplay";
import HistoryView from "./components/HistoryView";
import "./App.css";

// Screens: "topics" | "question" | "feedback" | "history"

export default function App() {
  const [screen, setScreen] = useState("topics");

  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicsError, setTopicsError] = useState(null);

  const [session, setSession] = useState(null); // { sessionId, topicName, questionText }
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  useEffect(() => {
    fetchTopics()
      .then(setTopics)
      .catch((e) => setTopicsError(e.message))
      .finally(() => setTopicsLoading(false));
  }, []);

  const handleSelectTopic = async (topicId) => {
    setSubmitError(null);
    try {
      const result = await startSession(topicId);
      setSession(result);
      setScreen("question");
    } catch (e) {
      setTopicsError(e.message);
    }
  };

  const handleSubmitAnswer = async (answerText) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitAnswer(session.sessionId, answerText);
      setFeedback(result);
      setScreen("feedback");
    } catch (e) {
      setSubmitError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePracticeAgain = () => {
    setSession(null);
    setFeedback(null);
    setScreen("topics");
  };

  const handleViewHistory = () => {
    setScreen("history");
    setHistoryLoading(true);
    setHistoryError(null);
    fetchHistory()
      .then(setHistory)
      .catch((e) => setHistoryError(e.message))
      .finally(() => setHistoryLoading(false));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Interview Practice Partner</h1>
        <nav>
          <button onClick={() => setScreen("topics")} disabled={screen === "topics"}>
            Practice
          </button>
          <button onClick={handleViewHistory} disabled={screen === "history"}>
            History
          </button>
        </nav>
      </header>

      <main>
        {screen === "topics" && (
          <TopicSelector
            topics={topics}
            onSelectTopic={handleSelectTopic}
            loading={topicsLoading}
            error={topicsError}
          />
        )}

        {screen === "question" && session && (
          <QuestionAnswer
            session={session}
            onSubmitAnswer={handleSubmitAnswer}
            submitting={submitting}
            error={submitError}
          />
        )}

        {screen === "feedback" && feedback && (
          <FeedbackDisplay feedback={feedback} onPracticeAgain={handlePracticeAgain} />
        )}

        {screen === "history" && (
          <HistoryView history={history} loading={historyLoading} error={historyError} />
        )}
      </main>
    </div>
  );
}
