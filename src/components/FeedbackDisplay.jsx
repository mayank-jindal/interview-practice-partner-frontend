import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

export default function FeedbackDisplay({ feedback, onPracticeAgain }) {
  const scoreCards = [
    { label: "Completeness", value: `${feedback.completenessScore}/5`, ok: feedback.completenessScore >= 3 },
    { label: "Communication Clarity", value: `${feedback.communicationClarityScore}/5`, ok: feedback.communicationClarityScore >= 3 },
    { label: "Trade-offs", value: feedback.coveredTradeoffs ? "Covered" : "Missed", ok: feedback.coveredTradeoffs },
    { label: "Edge Cases", value: feedback.coveredEdgeCases ? "Covered" : "Missed", ok: feedback.coveredEdgeCases },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">Feedback</h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {scoreCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border p-4 ${
              card.ok ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-center gap-1.5">
              {card.ok ? (
                <CheckCircle2 size={14} className="text-emerald-600" />
              ) : (
                <XCircle size={14} className="text-red-500" />
              )}
              <p className="text-xs text-slate-500">{card.label}</p>
            </div>
            <p className={`mt-1.5 text-lg font-bold ${card.ok ? "text-emerald-700" : "text-red-700"}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Critique
        </h3>
        <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-800">
          {feedback.feedbackText}
        </p>
      </div>

      <button
        onClick={onPracticeAgain}
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
      >
        Practice Another Topic
        <ArrowRight size={15} />
      </button>
    </div>
  );
}
