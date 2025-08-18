// front-end/src/lib/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

let socket = null;
let joinedUserId = null;

export function connectAs(userId) {
  if (!userId) return null;

  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"],
      autoConnect: false,
    });

    socket.on("connect_error", (e) => {
      console.warn("[socket] connect_error:", e?.message || e);
    });
  }

  if (!socket.connected) socket.connect();

  if (joinedUserId !== String(userId)) {
    joinedUserId = String(userId);
    socket.emit("join", joinedUserId);
  }

  return socket;
}

export function on(event, cb) {
  socket?.on(event, cb);
}
export function off(event, cb) {
  socket?.off(event, cb);
}

export function onNewMessage(cb) {
  on("newMessage", cb);
}
export function offNewMessage(cb) {
  off("newMessage", cb);
}

export function sendMessage(payload) {
  socket?.emit("sendMessage", payload);
}

export default {
  connectAs,
  onNewMessage,
  offNewMessage,
  sendMessage,
  on,
  off,
};
