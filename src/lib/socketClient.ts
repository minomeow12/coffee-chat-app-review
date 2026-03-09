import { io, Socket } from "socket.io-client";

const SERVER_URL = "https://pretorial-portliest-vertie.ngrok-free.dev";

let socket: Socket | null = null;

// ✅ Module-level callback — set by ChatApp, never re-registered on socket
let onMessageReceived: ((msg: any) => void) | null = null;

export function setMessageHandler(handler: (msg: any) => void) {
  onMessageReceived = handler;
}

export function initializeSocket(userId?: string) {
  if (socket && socket.connected) return socket;

  if (socket) socket.disconnect();

  socket = io(SERVER_URL, {
    withCredentials: true,
    transports: ["websocket"],
    autoConnect: true,
    query: { userId },
  });

  socket.on("connect", () => {
    console.log("✅ CONNECTED:", socket?.id);
    (window as any)._debug_socket = socket;
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ DISCONNECTED:", reason);
  });

  // ✅ Register ONCE at socket creation — never removed
  socket.on("receiveMessage", (msg: any) => {
    console.log("🔥 receiveMessage FIRED:", msg);
    if (onMessageReceived) onMessageReceived(msg);
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
