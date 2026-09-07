import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { fetchTopics, startSession, submitAnswer, fetchHistory } from "./api";
import TopicSelector from "./components/TopicSelector";
import QuestionAnswer from "./components/QuestionAnswer";
import FeedbackDisplay from "./components/FeedbackDisplay";
import HistoryView from "./components/HistoryView";
import ScoreDashboard from "./components/ScoreDashboard";

const NAV_ITEMS = [
  { key: "topics", label: "Practice" },
  { key: "dashboard", label: "Dashboard" },
  { key: "history", label: "History" },
];

export default function App() {
  const [screen, setScreen] = useState("topics");

  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicsError, setTopicsError] = useState(null);

  const [session, setSession] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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
      setHistoryLoaded(false);
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

  const goTo = (key) => {
    setScreen(key);
    if (key === "history" || key === "dashboard") loadHistoryIfNeeded();
  };

  const containerWidth = screen === "question" ? "max-w-6xl" : "max-w-4xl";

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Sparkles size={16} className="text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-100">
              Interview Practice Partner
            </h1>
          </div>
          <nav className="flex gap-1 rounded-lg bg-slate-900 p-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => goTo(item.key)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  screen === item.key
                    ? "bg-slate-800 text-slate-100"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className={`mx-auto ${containerWidth} px-6 py-8 transition-all`}>
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
