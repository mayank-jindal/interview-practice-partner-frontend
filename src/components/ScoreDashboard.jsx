import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ScoreDashboard({ history, loading, error }) {
  const [selectedTopic, setSelectedTopic] = useState("All Topics");

  const topicNames = useMemo(() => {
    const names = [...new Set(history.map((h) => h.topicName))];
    return ["All Topics", ...names.sort()];
  }, [history]);

  const chartData = useMemo(() => {
    const filtered =
      selectedTopic === "All Topics"
        ? history
        : history.filter((h) => h.topicName === selectedTopic);

    // History comes back newest-first from the API; charts read left-to-right
    // chronologically, so reverse it.
    return [...filtered]
      .reverse()
      .map((h) => ({
        date: new Date(h.completedAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        completeness: h.completenessScore,
        clarity: h.communicationClarityScore,
        topic: h.topicName,
      }));
  }, [history, selectedTopic]);

  if (loading) return <p className="status-text">Loading dashboard...</p>;
  if (error) return <p className="status-text error">Failed to load dashboard: {error}</p>;
  if (history.length === 0) {
    return <p className="status-text">No completed sessions yet — practice a topic to start seeing trends.</p>;
  }

  return (
    <div className="score-dashboard">
      <div className="dashboard-header">
        <h2>Score Trends</h2>
        <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
          {topicNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {chartData.length < 2 ? (
        <p className="status-text">
          Need at least 2 completed sessions on this topic to show a trend line.
        </p>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="completeness"
                name="Completeness"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="clarity"
                name="Communication Clarity"
                stroke="#16a34a"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}