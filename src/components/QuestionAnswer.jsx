import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Layers, Boxes, Code2 } from "lucide-react";

const CATEGORY_META = {
  HLD: { label: "High-Level Design", badge: "bg-blue-500/10 text-blue-400", icon: Layers },
  LLD: { label: "Low-Level Design", badge: "bg-purple-500/10 text-purple-400", icon: Boxes },
  DSA: { label: "DSA", badge: "bg-emerald-500/10 text-emerald-400", icon: Code2 },
};

const markdownComponents = {
  p: ({ children }) => <p className="mb-3 text-[15px] leading-relaxed text-slate-200">{children}</p>,
  ul: ({ children }) => <ul className="mb-3 list-disc space-y-1.5 pl-5 text-[15px] text-slate-200">{children}</ul>,
  ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1.5 pl-5 text-[15px] text-slate-200">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-slate-100">{children}</strong>,
  h1: ({ children }) => <h4 className="mb-2 mt-4 font-semibold text-slate-100">{children}</h4>,
  h2: ({ children }) => <h4 className="mb-2 mt-4 font-semibold text-slate-100">{children}</h4>,
  h3: ({ children }) => <h4 className="mb-2 mt-4 font-semibold text-slate-100">{children}</h4>,
  code: ({ children }) => <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-sm text-emerald-300">{children}</code>,
};

export default function QuestionAnswer({ session, onSubmitAnswer, submitting, error }) {
  const [answerText, setAnswerText] = useState("");
  const isCode = session.category === "DSA";
  const meta = CATEGORY_META[session.category] || CATEGORY_META.HLD;
  const Icon = meta.icon;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    onSubmitAnswer(answerText);
  };

  const handleKeyDown = (e) => {
    if (!isCode || e.key !== "Tab") return;
    e.preventDefault();
    const { selectionStart, selectionEnd, value } = e.target;
    const newValue = value.slice(0, selectionStart) + "  " + value.slice(selectionEnd);
    setAnswerText(newValue);
    requestAnimationFrame(() => {
      e.target.selectionStart = e.target.selectionEnd = selectionStart + 2;
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
      <div className="lg:sticky lg:top-24">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.badge}`}>
            <Icon size={13} strokeWidth={2.5} />
            {session.topicName}
          </span>
          <div className="mt-4">
            <ReactMarkdown components={markdownComponents}>{session.questionText}</ReactMarkdown>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {isCode ? (
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="// Explain your approach, then write your code here..."
            disabled={submitting}
            spellCheck={false}
            className="min-h-[420px] flex-1 resize-y rounded-2xl border border-slate-700 bg-slate-900 p-4 font-mono text-sm leading-relaxed text-slate-100 placeholder-slate-500 shadow-sm outline-none ring-blue-500 focus:ring-2 disabled:opacity-60 lg:min-h-[560px]"
          />
        ) : (
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Type your answer here..."
            disabled={submitting}
            className="min-h-[420px] flex-1 resize-y rounded-2xl border border-slate-700 bg-slate-900 p-4 text-sm leading-relaxed text-slate-100 placeholder-slate-500 shadow-sm outline-none ring-blue-500 focus:ring-2 disabled:opacity-60 lg:min-h-[560px]"
          />
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !answerText.trim()}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {submitting ? "Evaluating..." : (<><Send size={15} /> Submit Answer</>)}
        </button>
      </form>
    </div>
  );
}
