// front-end/src/pages/MessagePage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import {
  getConversations,
  createConversation,
  getMessages,
  getListing,
  deleteConversation,
  deleteMessage,
} from "../lib/api";

import {
  connectAs,
  on,
  off,
  sendMessage as socketSend,
} from "../lib/socket";

const COLORS = {
  pageBg: "#0f172a",
  paneBg: "#111827",
  paneBorder: "#1f2937",
  textPrimary: "#e5e7eb",
  textMuted: "#9ca3af",
  accent: "#4A72A4",
  accentHover: "#35547a",
  bubbleOther: "#e5e7eb",
  bubbleOtherText: "#111827",
};

function convoKey(c) {
  const parts = (c.participants || []).map(String).sort().join(",");
  return `${c.listingId || "null"}|${parts}`;
}

export default function MessagePage() {
  const auth = getAuth();
  const [authReady, setAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);

  // wait for Firebase auth to settle (prevents false "please log in" flashes)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUserId(u?.uid || null);
      setAuthReady(true);
    });
    return unsub;
  }, [auth]);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const listingIdQS = params.get("listingId");
  const sellerIdQS = params.get("sellerId");

  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [listing, setListing] = useState(null);
  const [text, setText] = useState("");

  const activeConvoIdRef = useRef(null);
  const seenKeysRef = useRef(new Set());

  // socket connect after auth
  useEffect(() => {
    if (!userId) return;
    connectAs(userId);
  }, [userId]);

  // fetch conversations (deduped)
  useEffect(() => {
    if (!userId) return;
    getConversations(userId)
      .then((convos) => {
        const map = new Map();
        for (const c of convos) {
          const key = convoKey(c);
          const prev = map.get(key);
          if (!prev) map.set(key, c);
          else {
            const pt = new Date(prev.updatedAt || 0).getTime();
            const ct = new Date(c.updatedAt || 0).getTime();
            map.set(key, ct >= pt ? c : prev);
          }
        }
        setConversations(Array.from(map.values()));
      })
      .catch(console.error);
  }, [userId]);

  // deep-link from listing page
  useEffect(() => {
    if (!userId || !listingIdQS || !sellerIdQS) return;

    // prevent self-DM: if listing owner == me, just open existing convo if any
    if (sellerIdQS === userId) {
      const existing = conversations.find(
        (c) =>
          String(c.listingId) === String(listingIdQS) &&
          c.participants?.includes(userId)
      );
      if (existing) selectConversation(existing);
      navigate("/messages", { replace: true });
      return;
    }

    (async () => {
      try {
        const convo = await createConversation(userId, sellerIdQS, listingIdQS);
        setConversations((prev) => {
          const map = new Map(prev.map((c) => [convoKey(c), c]));
          map.set(convoKey(convo), convo);
          return Array.from(map.values());
        });
        await selectConversation(convo);
      } catch (e) {
        console.error(e);
      } finally {
        navigate("/messages", { replace: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, listingIdQS, sellerIdQS, conversations.length]);

  async function selectConversation(convo) {
    setSelectedConvo(convo);
    activeConvoIdRef.current = String(convo._id);
    seenKeysRef.current = new Set(); // reset dedupe scope per convo

    // fetch listing
    try {
      if (convo.listing?._id) setListing(convo.listing);
      else if (convo.listingId) setListing(await getListing(convo.listingId));
      else setListing(null);
    } catch {
      setListing(null);
    }

    // fetch messages
    try {
      const msgs = await getMessages(convo._id);
      setMessages(msgs || []);
      for (const m of msgs || []) {
        const k =
          (m._id && String(m._id)) ||
          `${m.senderId}|${m.text}|${new Date(m.createdAt).getTime()}`;
        seenKeysRef.current.add(k);
      }
    } catch (e) {
      console.error("getMessages:", e);
      setMessages([]);
    }
  }

  // socket listeners
  useEffect(() => {
    if (!userId) return;

    const onNew = (msg) => {
      if (String(msg.conversationId) !== activeConvoIdRef.current) return;

      const keyById = msg._id ? String(msg._id) : null;
      const keyByFp = `${msg.senderId}|${msg.text}`;

      if (keyById && seenKeysRef.current.has(keyById)) return;

      // replace optimistic temp if present
      if (seenKeysRef.current.has(keyByFp)) {
        setMessages((prev) => {
          const withoutTemps = prev.filter(
            (m) =>
              !(
                String(m._id || "").startsWith("temp-") &&
                m.senderId === msg.senderId &&
                m.text === msg.text
              )
          );
          return [...withoutTemps, msg];
        });
        seenKeysRef.current.add(keyById || keyByFp);
        return;
      }

      const fallback =
        keyById || `${msg.senderId}|${msg.text}|${new Date(msg.createdAt).getTime()}`;
      if (!seenKeysRef.current.has(fallback)) {
        seenKeysRef.current.add(fallback);
        setMessages((prev) => [...prev, msg]);
      }
    };

    const onMsgDeleted = ({ conversationId, messageId }) => {
      if (String(conversationId) !== activeConvoIdRef.current) return;
      setMessages((prev) => prev.filter((m) => String(m._id) !== String(messageId)));
    };

    const onConvoDeleted = ({ conversationId }) => {
      setConversations((prev) =>
        prev.filter((c) => String(c._id) !== String(conversationId))
      );
      if (String(activeConvoIdRef.current) === String(conversationId)) {
        setSelectedConvo(null);
        setMessages([]);
        setListing(null);
        activeConvoIdRef.current = null;
      }
    };

    on("newMessage", onNew);
    on("messageDeleted", onMsgDeleted);
    on("conversationDeleted", onConvoDeleted);

    return () => {
      off("newMessage", onNew);
      off("messageDeleted", onMsgDeleted);
      off("conversationDeleted", onConvoDeleted);
    };
  }, [userId, selectedConvo]);

  // owner cannot send first
  const isOwner = useMemo(() => {
    if (!listing || !userId) return false;
    return String(listing.userId) === String(userId);
  }, [listing, userId]);

  const hasMessageFromOther = useMemo(() => {
    if (!selectedConvo || !userId) return false;
    return messages.some((m) => String(m.senderId) !== String(userId));
  }, [messages, selectedConvo, userId]);

  const canSend = !!selectedConvo && (!isOwner || hasMessageFromOther);

  // send (optimistic + enter key)
  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !selectedConvo || !userId || !canSend) return;

    const recipientId = selectedConvo.participants.find((id) => id !== userId);

    const tempId = `temp-${Date.now()}`;
    const tempMsg = {
      _id: tempId,
      conversationId: selectedConvo._id,
      senderId: userId,
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    const fp = `${userId}|${trimmed}`;
    seenKeysRef.current.add(tempId);
    seenKeysRef.current.add(fp);

    setMessages((prev) => [...prev, tempMsg]);
    setText("");

    socketSend({
      conversationId: selectedConvo._id,
      senderId: userId,
      recipientId,
      text: trimmed,
    });
  };

  const onKeyDownInput = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // unsend one message
  const handleUnsend = async (messageId) => {
    try {
      await deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => String(m._id) !== String(messageId)));
    } catch (e) {
      console.error(e);
    }
  };

  // delete entire conversation
  const handleDeleteConversation = async () => {
    if (!selectedConvo) return;
    const ok = window.confirm("Delete this conversation for both participants?");
    if (!ok) return;
    try {
      await deleteConversation(selectedConvo._id);
      setConversations((prev) =>
        prev.filter((c) => String(c._id) !== String(selectedConvo._id))
      );
      setSelectedConvo(null);
      setMessages([]);
      setListing(null);
      activeConvoIdRef.current = null;
    } catch (e) {
      console.error(e);
    }
  };

  // ---------- RENDER ----------
  return (
    <>
      <Navbar />
      {!authReady ? (
        <div style={{ padding: 24, color: "#e5e7eb" }}>Loading…</div>
      ) : !userId ? (
        <div style={{ padding: 24, color: "#e5e7eb" }}>
          Please <a href="/login" style={{ color: "#8ab4ff" }}>log in</a> to use Messages.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr 360px",
            height: "calc(100vh - 60px)",
            background: COLORS.pageBg,
            color: COLORS.textPrimary,
          }}
        >
          {/* Left: Conversations */}
          <div
            style={{
              background: COLORS.paneBg,
              borderRight: `1px solid ${COLORS.paneBorder}`,
              overflowY: "auto",
            }}
          >
            <div
              style={{
                padding: 14,
                fontWeight: 700,
                fontSize: 18,
                borderBottom: `1px solid ${COLORS.paneBorder}`,
              }}
            >
              Conversations
            </div>
            {conversations.length === 0 && (
              <div style={{ padding: 14, color: COLORS.textMuted }}>
                No conversations yet.
              </div>
            )}
            {conversations.map((convo) => {
              const isActive = selectedConvo?._id === convo._id;
              const title = convo.listing?.title || "Chat";
              const ownerOfThis =
                convo.listing?.userId &&
                String(convo.listing.userId) === String(userId);
              return (
                <button
                  key={convo._id}
                  onClick={() => selectConversation(convo)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 12px",
                    border: "0",
                    borderBottom: `1px solid ${COLORS.paneBorder}`,
                    background: isActive ? "#1b2437" : "transparent",
                    cursor: "pointer",
                    color: COLORS.textPrimary,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>
                    {title}
                    {ownerOfThis ? " • (your listing)" : ""}
                  </div>
                  <div
                    style={{
                      color: COLORS.textMuted,
                      fontSize: 13,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {convo.lastMessage ||
                      (ownerOfThis ? "Waiting for buyer…" : "Start chatting…")}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Middle: Chat */}
          <div
            style={{
              display: "grid",
              gridTemplateRows: "auto 1fr auto",
              minWidth: 0,
              background: COLORS.paneBg,
            }}
          >
            <div
              style={{
                padding: 12,
                borderBottom: `1px solid ${COLORS.paneBorder}`,
                fontWeight: 700,
                background: "#0b1220",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>{listing ? listing.title : "Messages"}</span>
              {selectedConvo && (
                <button
                  onClick={handleDeleteConversation}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid #b91c1c`,
                    background: "#b91c1c",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  Delete conversation
                </button>
              )}
            </div>

            <div style={{ overflowY: "auto", padding: 16 }}>
              {!selectedConvo && (
                <div style={{ color: COLORS.textMuted }}>
                  Select a conversation to view messages.
                </div>
              )}
              {selectedConvo &&
                messages.map((msg) => {
                  const mine = String(msg.senderId) === String(userId);
                  return (
                    <div
                      key={msg._id || `${msg.senderId}-${msg.createdAt}-${msg.text}`}
                      style={{
                        display: "flex",
                        justifyContent: mine ? "flex-end" : "flex-start",
                        marginBottom: 8,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "70%",
                          padding: "10px 14px",
                          borderRadius: 14,
                          background: mine ? COLORS.accent : COLORS.bubbleOther,
                          color: mine ? "#fff" : COLORS.bubbleOtherText,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                          position: "relative",
                        }}
                      >
                        {msg.text}
                        {mine && msg._id && (
                          <button
                            title="Unsend"
                            onClick={() => handleUnsend(msg._id)}
                            style={{
                              position: "absolute",
                              top: -8,
                              right: -8,
                              width: 22,
                              height: 22,
                              borderRadius: "50%",
                              border: "none",
                              background: "#ef4444",
                              color: "#fff",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                padding: 12,
                borderTop: `1px solid ${COLORS.paneBorder}`,
              }}
            >
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKeyDownInput}
                placeholder={
                  !selectedConvo
                    ? "Select a conversation…"
                    : !canSend
                    ? "Waiting for buyer to message…"
                    : "Type a message…"
                }
                disabled={!canSend}
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: `1px solid ${COLORS.paneBorder}`,
                  background: "#0b1220",
                  color: COLORS.textPrimary,
                  outline: "none",
                }}
              />
              <button
                onClick={handleSend}
                disabled={!canSend || !text.trim()}
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: `1px solid ${COLORS.accent}`,
                  background: COLORS.accent,
                  color: "#fff",
                  cursor: !canSend || !text.trim() ? "not-allowed" : "pointer",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = COLORS.accentHover)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = COLORS.accent)
                }
              >
                Send
              </button>
            </div>
          </div>

          {/* Right: Listing details */}
          <div
            style={{
              background: COLORS.paneBg,
              borderLeft: `1px solid ${COLORS.paneBorder}`,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Listing Details</div>
            {!listing && (
              <div style={{ color: COLORS.textMuted }}>No listing selected.</div>
            )}
            {listing && (
              <div>
                {listing.image && (
                  <img
                    src={listing.image}
                    alt={listing.title}
                    style={{
                      width: "100%",
                      borderRadius: 8,
                      marginBottom: 8,
                      display: "block",
                      border: `1px solid ${COLORS.paneBorder}`,
                    }}
                  />
                )}
                <div style={{ fontSize: 18, fontWeight: 700 }}>{listing.title}</div>
                <div style={{ marginTop: 6 }}>
                  <strong>Price:</strong> ${listing.price}
                </div>
                <div style={{ marginTop: 6 }}>
                  <strong>Category:</strong> {listing.category}
                </div>
                <div style={{ marginTop: 8 }}>{listing.description}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

