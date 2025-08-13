// front-end/src/lib/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

// Singleton socket (one connection for the whole app)
let socket;

/**
 * Connect as a specific user and join their private room.
 * Safe to call multiple times; it will reuse the same socket.
 */
export function connectAs(userId) {
  if (!userId) return;

  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
      transports: ["websocket", "polling"],
    });

    // On reconnect (network hiccups), re-join the user room
    socket.on("connect", () => {
      socket.emit("join", String(userId));
    });
  }

  if (!socket.connected) {
    socket.connect();
  } else {
    // already connected; ensure we're joined
    socket.emit("join", String(userId));
  }

  return socket;
}

export function onNewMessage(handler) {
  if (!socket) return;
  socket.on("newMessage", handler);
}

export function offNewMessage(handler) {
  if (!socket) return;
  socket.off("newMessage", handler);
}

export function sendMessage({ conversationId, senderId, recipientId, text }) {
  if (!socket) return;
  socket.emit("sendMessage", { conversationId, senderId, recipientId, text });
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = undefined;
  }
}
