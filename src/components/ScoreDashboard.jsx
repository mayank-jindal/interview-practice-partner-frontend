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
import { Layers, Target, MessageSquare, Scale } from "lucide-react";

export default function ScoreDashboard({ history, loading, error }) {
  const [selectedTopic, setSelectedTopic] = useState("All Topics");

  const topicNames = useMemo(() => {
    const names = [...new Set(history.map((h) => h.topicName))];
    return ["All Topics", ...names.sort()];
  }, [history]);

  const filtered = useMemo(
    () =>
      selectedTopic === "All Topics"
        ? history
        : history.filter((h) => h.topicName === selectedTopic),
    [history, selectedTopic]
  );

  const stats = useMemo(() => {
    if (filtered.length === 0) return null;
    const avg = (key) => (filtered.reduce((s, h) => s + h[key], 0) / filtered.length).toFixed(1);
    const tradeoffRate = Math.round(
      (filtered.filter((h) => h.coveredTradeoffs).length / filtered.length) * 100
    );
    return {
      total: filtered.length,
      avgCompleteness: avg("completenessScore"),
      avgClarity: avg("communicationClarityScore"),
      tradeoffRate,
    };
  }, [filtered]);

  const chartData = useMemo(() => {
    return [...filtered]
      .reverse()
      .map((h) => ({
        date: new Date(h.completedAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        completeness: h.completenessScore,
        clarity: h.communicationClarityScore,
      }));
  }, [filtered]);

  if (loading) return <p className="text-slate-500">Loading dashboard...</p>;
  if (error) return <p className="text-red-600">Failed to load dashboard: {error}</p>;
  if (history.length === 0) {
    return (
      <p className="text-slate-500">
        No completed sessions yet — practice a topic to start seeing trends.
      </p>
    );
  }

  const statCards = stats
    ? [
        { label: "Sessions Practiced", value: stats.total, icon: Layers, color: "text-blue-600 bg-blue-50" },
        { label: "Avg Completeness", value: `${stats.avgCompleteness}/5`, icon: Target, color: "text-emerald-600 bg-emerald-50" },
        { label: "Avg Clarity", value: `${stats.avgClarity}/5`, icon: MessageSquare, color: "text-purple-600 bg-purple-50" },
        { label: "Trade-off Coverage", value: `${stats.tradeoffRate}%`, icon: Scale, color: "text-amber-600 bg-amber-50" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Score Trends</h2>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          {topicNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg ${card.color}`}>
                <Icon size={16} />
              </div>
              <p className="text-xs text-slate-500">{card.label}</p>
              <p className="mt-0.5 text-xl font-bold text-slate-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      {chartData.length < 2 ? (
        <p className="text-slate-500">
          Need at least 2 completed sessions on this topic to show a trend line.
        </p>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
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
