const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const API_KEY = import.meta.env.VITE_API_KEY || "dev-local-key";

function authHeaders(extra = {}) {
  return { "X-API-Key": API_KEY, ...extra };
}

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function fetchTopics() {
  const res = await fetch(`${BASE_URL}/topics`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function startSession(topicId) {
  const res = await fetch(`${BASE_URL}/sessions/start?topicId=${topicId}`, {
    method: "POST",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function submitAnswer(sessionId, answerText) {
  const res = await fetch(`${BASE_URL}/sessions/answer`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ sessionId, answerText }),
  });
  return handleResponse(res);
}

export async function fetchHistory() {
  const res = await fetch(`${BASE_URL}/sessions/history`, { headers: authHeaders() });
  return handleResponse(res);
}
