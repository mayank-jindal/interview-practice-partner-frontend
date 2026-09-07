import { useState } from "react";
import { Send, Layers, Boxes, Code2 } from "lucide-react";

const CATEGORY_META = {
  HLD: { label: "High-Level Design", badge: "bg-blue-100 text-blue-700", icon: Layers },
  LLD: { label: "Low-Level Design", badge: "bg-purple-100 text-purple-700", icon: Boxes },
  DSA: { label: "DSA", badge: "bg-emerald-100 text-emerald-700", icon: Code2 },
};

// The LLM already sends \n\n between paragraphs - plain HTML collapses that
// whitespace by default, which is what made questions look like one wall of
// text. Splitting into real paragraph blocks, and preserving single
// newlines within each (e.g. "Input: ...\nOutput: ..." style lines) via
// whitespace-pre-line, actually renders the structure that's already there.
function splitIntoParagraphs(text) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function QuestionAnswer({ session, onSubmitAnswer, submitting, error }) {
  const [answerText, setAnswerText] = useState("");
  const isCode = session.category === "DSA";
  const meta = CATEGORY_META[session.category] || CATEGORY_META.HLD;
  const Icon = meta.icon;
  const paragraphs = splitIntoParagraphs(session.questionText);

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
      {/* Left: question, sticky so it stays visible while writing a long answer */}
      <div className="lg:sticky lg:top-24">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.badge}`}
          >
            <Icon size={13} strokeWidth={2.5} />
            {session.topicName}
          </span>

          <div className="mt-4 space-y-4">
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className="whitespace-pre-line text-[15px] leading-relaxed text-slate-800"
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Right: answer input, taller and wider than before since it now
          owns half the viewport instead of sitting under a centered block */}
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
            className="min-h-[420px] flex-1 resize-y rounded-2xl border border-slate-300 bg-white p-4 text-sm leading-relaxed text-slate-900 placeholder-slate-400 shadow-sm outline-none ring-blue-500 focus:ring-2 disabled:opacity-60 lg:min-h-[560px]"
          />
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !answerText.trim()}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {submitting ? (
            "Evaluating..."
          ) : (
            <>
              <Send size={15} /> Submit Answer
            </>
          )}
        </button>
      </form>
    </div>
  );
}
