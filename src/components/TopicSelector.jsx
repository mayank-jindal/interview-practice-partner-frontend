import { Layers, Boxes, Code2, ChevronRight } from "lucide-react";

const CATEGORY_META = {
  HLD: {
    label: "High-Level Design",
    icon: Layers,
    iconWrap: "bg-blue-100 text-blue-600",
    accent: "hover:border-blue-300 hover:shadow-blue-100",
  },
  LLD: {
    label: "Low-Level Design",
    icon: Boxes,
    iconWrap: "bg-purple-100 text-purple-600",
    accent: "hover:border-purple-300 hover:shadow-purple-100",
  },
  DSA: {
    label: "Data Structures & Algorithms",
    icon: Code2,
    iconWrap: "bg-emerald-100 text-emerald-600",
    accent: "hover:border-emerald-300 hover:shadow-emerald-100",
  },
};

export default function TopicSelector({ topics, onSelectTopic, loading, error }) {
  if (loading) return <p className="text-slate-500">Loading topics...</p>;
  if (error) return <p className="text-red-600">Failed to load topics: {error}</p>;

  const order = ["HLD", "LLD", "DSA"];

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pick a topic</h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose a topic to get a senior-level interview question, tailored to its category.
        </p>
      </div>

      {order.map((category) => {
        const meta = CATEGORY_META[category];
        const Icon = meta.icon;
        const categoryTopics = topics.filter((t) => t.category === category);
        if (categoryTopics.length === 0) return null;

        return (
          <section key={category}>
            <div className="mb-3 flex items-center gap-2">
              <div className={`flex h-6 w-6 items-center justify-center rounded-md ${meta.iconWrap}`}>
                <Icon size={13} strokeWidth={2.5} />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {meta.label}
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {categoryTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => onSelectTopic(topic.id)}
                  className={`group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left text-sm font-medium text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${meta.accent}`}
                >
                  {topic.name}
                  <ChevronRight
                    size={16}
                    className="text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500"
                  />
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
