// front-end/src/pages/MessagePage.jsx
import React, { useEffect, useRef, useState } from "react";
import { requireAuthOrNull } from "../auth/auth";
import { api } from "../lib/api";
import { connectAs, onNewMessage, offNewMessage, sendMessage } from "../lib/socket";

export default function MessagePage() {
  // --- LOGIN GUARD ---
  const currentUser = requireAuthOrNull();
  if (!currentUser) {
    return (
      <div style={{ maxWidth: 520, margin: "80px auto", padding: 24, border: "1px solid #ddd", borderRadius: 12 }}>
        <h2 style={{ marginBottom: 12 }}>Please log in</h2>
        <p>You must be logged in to access Messages.</p>
        <a href="/login" style={{ textDecoration: "underline" }}>Go to Login</a>
      </div>
    );
  }

  // --- STATE ---
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const listRef = useRef(null);

  // --- SOCKET + INITIAL FETCH ---
  useEffect(() => {
    // connect and join my private room
    connectAs(currentUser.id);

    // load my conversations
    api.getUserConversations(currentUser.id)
      .then(setConversations)
      .catch((e) => console.error("getUserConversations:", e.message));

    // live updates
    const handler = (msg) => {
      if (activeConversation && msg.conversationId === activeConversation._id) {
        setMessages((prev) => [...prev, msg]);
        requestAnimationFrame(() => {
          listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
        });
      } else {
        setConversations((prev) => {
          const copy = [...prev];
          const i = copy.findIndex((c) => c._id === msg.conversationId);
          if (i >= 0) {
            copy[i] = { ...copy[i], lastMessage: msg.text, updatedAt: new Date().toISOString() };
            const [item] = copy.splice(i, 1);
            copy.unshift(item);
          }
          return copy;
        });
      }
    };

    onNewMessage(handler);
    return () => offNewMessage(handler);
  }, [currentUser.id, activeConversation?._id]);

  // --- SELECT CONVERSATION ---
  async function selectConversation(convo) {
    setActiveConversation(convo);
    try {
      const msgs = await api.getMessages(convo._id);
      setMessages(msgs);
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
      });
    } catch (e) {
      console.error("getMessages:", e.message);
    }
  }

  // --- SEND MESSAGE ---
  function handleSend() {
    const text = draft.trim();
    if (!text || !activeConversation) return;

    const [a, b] = activeConversation.participants;
    const recipientId = String(a) === String(currentUser.id) ? String(b) : String(a);

    sendMessage({
      conversationId: activeConversation._id,
      senderId: currentUser.id,
      recipientId,
      text,
    });
    setDraft("");
  }

  // --- UI ---
  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", height: "calc(100vh - 80px)" }}>
      {/* Sidebar */}
      <aside style={{ borderRight: "1px solid #eee", padding: 12 }}>
        <h3 style={{ margin: "8px 0 12px" }}>Conversations</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {conversations.length === 0 && (
            <div style={{ color: "#666" }}>No conversations yet.</div>
          )}
          {conversations.map((c) => {
            const isActive = activeConversation?._id === c._id;
            return (
              <button
                key={c._id}
                onClick={() => selectConversation(c)}
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #e5e5e5",
                  background: isActive ? "#f4f6ff" : "#fff",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 600 }}>Chat</div>
                <div style={{ color: "#555", fontSize: 13 }}>{c.lastMessage || "Start chatting…"}</div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Chat area */}
      <section style={{ display: "grid", gridTemplateRows: "auto 1fr auto", height: "100%" }}>
        <header style={{ padding: 12, borderBottom: "1px solid #eee" }}>
          <strong>Messages</strong>
        </header>

        <div ref={listRef} style={{ overflowY: "auto", padding: 16, background: "#fafafa" }}>
          {!activeConversation && (
            <div style={{ color: "#666" }}>Select a conversation to view messages.</div>
          )}
          {activeConversation && messages.map((m) => {
            const isMine = String(m.senderId) === String(currentUser.id);
            return (
              <div key={m._id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start", marginBottom: 8 }}>
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "8px 12px",
                    borderRadius: 12,
                    background: isMine ? "#dfe7ff" : "#fff",
                    border: "1px solid #e5e5e5",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>

        <footer style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #eee" }}>
          <input
            type="text"
            placeholder={activeConversation ? "Type a message…" : "Select a conversation to start…"}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            disabled={!activeConversation}
            style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
          <button
            onClick={handleSend}
            disabled={!activeConversation || !draft.trim()}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #333", background: "#333", color: "#fff", cursor: "pointer" }}
          >
            Send
          </button>
        </footer>
      </section>
    </div>
  );
}
