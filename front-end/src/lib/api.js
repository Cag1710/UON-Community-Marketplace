// front-end/src/lib/api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'include',
    ...options,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json();
}

// --- Conversations ---
export const api = {
  getUserConversations(userId) {
    return request(`/api/conversations/${userId}`);
  },
  createOrGetConversation(userA, userB) {
    return request(`/api/conversations`, {
      method: 'POST',
      body: JSON.stringify({ userA, userB }),
    });
  },
  getMessages(conversationId) {
    return request(`/api/messages/${conversationId}`);
  },
  postMessage({ conversationId, senderId, text }) {
    return request(`/api/messages`, {
      method: 'POST',
      body: JSON.stringify({ conversationId, senderId, text }),
    });
  },
};
