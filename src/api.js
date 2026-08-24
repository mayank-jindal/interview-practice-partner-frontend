const BASE_URL = "http://localhost:8080/api";

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function fetchTopics() {
  const res = await fetch(`${BASE_URL}/topics`);
  return handleResponse(res);
}

export async function startSession(topicId) {
  const res = await fetch(`${BASE_URL}/sessions/start?topicId=${topicId}`, {
    method: "POST",
  });
  return handleResponse(res);
}

export async function submitAnswer(sessionId, answerText) {
  const res = await fetch(`${BASE_URL}/sessions/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, answerText }),
  });
  return handleResponse(res);
}

export async function fetchHistory() {
  const res = await fetch(`${BASE_URL}/sessions/history`);
  return handleResponse(res);
}
