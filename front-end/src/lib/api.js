// src/utils/api.js
export const getConversations = async (userId) => {
  const res = await fetch(`http://localhost:8000/api/conversations/${userId}`);
  return res.json();
};

export const createConversation = async (userA, userB, listingId) => {
  const res = await fetch(`http://localhost:8000/api/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userA, userB, listingId })
  });
  return res.json();
};

export const deleteConversation = async (conversationId) => {
  const res = await fetch(`http://localhost:8000/api/conversations/${conversationId}`, {
    method: 'DELETE'
  });
  return res.json();
};

export const getMessages = async (conversationId) => {
  const res = await fetch(`http://localhost:8000/api/messages/${conversationId}`);
  return res.json();
};

export const sendMessage = async (conversationId, senderId, text) => {
  const res = await fetch(`http://localhost:8000/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId, senderId, text })
  });
  return res.json();
};

export const deleteMessage = async (messageId) => {
  const res = await fetch(`http://localhost:8000/api/messages/${messageId}`, {
    method: 'DELETE'
  });
  return res.json();
};

export const getListing = async (listingId) => {
  const res = await fetch(`http://localhost:8000/api/listings/${listingId}`);
  return res.json();
};
