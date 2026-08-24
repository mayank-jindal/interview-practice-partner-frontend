export default function TopicSelector({ topics, onSelectTopic, loading, error }) {
  if (loading) return <p className="status-text">Loading topics...</p>;
  if (error) return <p className="status-text error">Failed to load topics: {error}</p>;

  const systemDesignTopics = topics.filter((t) => t.category === "SYSTEM_DESIGN");
  const dsaTopics = topics.filter((t) => t.category === "DSA");

  return (
    <div className="topic-selector">
      <h2>Pick a topic</h2>

      <section>
        <h3>System Design</h3>
        <div className="topic-grid">
          {systemDesignTopics.map((topic) => (
            <button key={topic.id} className="topic-card" onClick={() => onSelectTopic(topic.id)}>
              {topic.name}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3>DSA</h3>
        <div className="topic-grid">
          {dsaTopics.map((topic) => (
            <button key={topic.id} className="topic-card" onClick={() => onSelectTopic(topic.id)}>
              {topic.name}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
