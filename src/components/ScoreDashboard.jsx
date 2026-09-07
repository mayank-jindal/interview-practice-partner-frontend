import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Layers, Target, MessageSquare, Scale } from "lucide-react";

export default function ScoreDashboard({ history, loading, error }) {
  const [selectedTopic, setSelectedTopic] = useState("All Topics");

  const topicNames = useMemo(() => {
    const names = [...new Set(history.map((h) => h.topicName))];
    return ["All Topics", ...names.sort()];
  }, [history]);

  const filtered = useMemo(
    () => (selectedTopic === "All Topics" ? history : history.filter((h) => h.topicName === selectedTopic)),
    [history, selectedTopic]
  );

  const stats = useMemo(() => {
    if (filtered.length === 0) return null;
    const avg = (key) => (filtered.reduce((s, h) => s + h[key], 0) / filtered.length).toFixed(1);
    const tradeoffRate = Math.round((filtered.filter((h) => h.coveredTradeoffs).length / filtered.length) * 100);
    return { total: filtered.length, avgCompleteness: avg("completenessScore"), avgClarity: avg("communicationClarityScore"), tradeoffRate };
  }, [filtered]);

  const chartData = useMemo(
    () => [...filtered].reverse().map((h) => ({
      date: new Date(h.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      completeness: h.completenessScore,
      clarity: h.communicationClarityScore,
    })),
    [filtered]
  );

  if (loading) return <p className="text-slate-400">Loading dashboard...</p>;
  if (error) return <p className="text-red-400">Failed to load dashboard: {error}</p>;
  if (history.length === 0) return <p className="text-slate-400">No completed sessions yet — practice a topic to start seeing trends.</p>;

  const statCards = stats ? [
    { label: "Sessions Practiced", value: stats.total, icon: Layers, color: "text-blue-400 bg-blue-500/10" },
    { label: "Avg Completeness", value: `${stats.avgCompleteness}/5`, icon: Target, color: "text-emerald-400 bg-emerald-500/10" },
    { label: "Avg Clarity", value: `${stats.avgClarity}/5`, icon: MessageSquare, color: "text-purple-400 bg-purple-500/10" },
    { label: "Trade-off Coverage", value: `${stats.tradeoffRate}%`, icon: Scale, color: "text-amber-400 bg-amber-500/10" },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">Score Trends</h2>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          {topicNames.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
              <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg ${card.color}`}><Icon size={16} /></div>
              <p className="text-xs text-slate-400">{card.label}</p>
              <p className="mt-0.5 text-xl font-bold text-slate-100">{card.value}</p>
            </div>
          );
        })}
      </div>

      {chartData.length < 2 ? (
        <p className="text-slate-400">Need at least 2 completed sessions on this topic to show a trend line.</p>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94a3b8" }} stroke="#334155" />
              <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 12, fill: "#94a3b8" }} stroke="#334155" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
              <Legend wrapperStyle={{ color: "#94a3b8" }} />
              <Line type="monotone" dataKey="completeness" name="Completeness" stroke="#60a5fa" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="clarity" name="Communication Clarity" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
