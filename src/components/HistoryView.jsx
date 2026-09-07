import ReactMarkdown from "react-markdown";
import { Layers, Boxes, Code2, ChevronDown } from "lucide-react";

const CATEGORY_META = {
  HLD: { badge: "bg-blue-500/10 text-blue-400", icon: Layers },
  LLD: { badge: "bg-purple-500/10 text-purple-400", icon: Boxes },
  DSA: { badge: "bg-emerald-500/10 text-emerald-400", icon: Code2 },
};

const mdComponents = {
  p: ({ children }) => <p className="mb-2 text-sm leading-relaxed text-slate-200">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 text-sm text-slate-200">{children}</ul>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-slate-100">{children}</strong>,
};

export default function HistoryView({ history, loading, error }) {
  if (loading) return <p className="text-slate-400">Loading history...</p>;
  if (error) return <p className="text-red-400">Failed to load history: {error}</p>;
  if (history.length === 0) return <p className="text-slate-400">No completed sessions yet.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight text-slate-100">Session History</h2>

      {history.map((item) => {
        const isCode = item.category === "DSA";
        const meta = CATEGORY_META[item.category] || CATEGORY_META.HLD;
        const Icon = meta.icon;

        return (
          <div key={item.sessionId} className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}>
                <Icon size={12} strokeWidth={2.5} />
                {item.topicName}
              </span>
              <span className="text-xs text-slate-500">{new Date(item.completedAt).toLocaleDateString()}</span>
            </div>

            <div className="mb-3">
              <ReactMarkdown components={mdComponents}>{item.questionText}</ReactMarkdown>
            </div>

            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-blue-400">
                View your answer and feedback
                <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-3 space-y-3 border-t border-slate-800 pt-3">
                <div>
                  <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Your Answer</h4>
                  {isCode ? (
                    <pre className="overflow-x-auto rounded-lg bg-slate-950 p-3 font-mono text-xs leading-relaxed text-slate-200">{item.answerText}</pre>
                  ) : (
                    <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">{item.answerText}</p>
                  )}
                </div>
                <div>
                  <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Feedback</h4>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">{item.feedbackText}</p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                  <span>Completeness: {item.completenessScore}/5</span>
                  <span>Clarity: {item.communicationClarityScore}/5</span>
                  <span>Trade-offs: {item.coveredTradeoffs ? "✓" : "✗"}</span>
                  <span>Edge cases: {item.coveredEdgeCases ? "✓" : "✗"}</span>
                </div>
              </div>
            </details>
          </div>
        );
      })}
    </div>
  );
}
