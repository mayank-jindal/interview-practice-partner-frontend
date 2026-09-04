import { useState, useEffect } from "react";
import { fetchTopics, startSession, submitAnswer, fetchHistory } from "./api";
import TopicSelector from "./components/TopicSelector";
import QuestionAnswer from "./components/QuestionAnswer";
import FeedbackDisplay from "./components/FeedbackDisplay";
import HistoryView from "./components/HistoryView";
import ScoreDashboard from "./components/ScoreDashboard";
import "./App.css";

// Screens: "topics" | "question" | "feedback" | "history" | "dashboard"

export default function App() {
  const [screen, setScreen] = useState("topics");

  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicsError, setTopicsError] = useState(null);

  const [session, setSession] = useState(null); // { sessionId, topicName, questionText }
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Shared between History and Dashboard views - both just render the same
  // completed-session data differently, so one fetch covers both.
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);

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
      setHistoryLoaded(false); // force a refetch next time history/dashboard is opened
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

  const loadHistoryIfNeeded = () => {
    if (historyLoaded) return;
    setHistoryLoading(true);
    setHistoryError(null);
    fetchHistory()
      .then((data) => {
        setHistory(data);
        setHistoryLoaded(true);
      })
      .catch((e) => setHistoryError(e.message))
      .finally(() => setHistoryLoading(false));
  };

  const handleViewHistory = () => {
    setScreen("history");
    loadHistoryIfNeeded();
  };

  const handleViewDashboard = () => {
    setScreen("dashboard");
    loadHistoryIfNeeded();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Interview Practice Partner</h1>
        <nav>
          <button onClick={() => setScreen("topics")} disabled={screen === "topics"}>
            Practice
          </button>
          <button onClick={handleViewDashboard} disabled={screen === "dashboard"}>
            Dashboard
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

        {screen === "dashboard" && (
          <ScoreDashboard history={history} loading={historyLoading} error={historyError} />
        )}
      </main>
    </div>
  );
}