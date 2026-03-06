import { io, Socket } from "socket.io-client";

const SERVER_URL = "https://pretorial-portliest-vertie.ngrok-free.dev";

let socket: Socket | null = null;

export function initializeSocket(userId?: string) {
  if (socket && socket.connected) {
    console.log("♻️ Reusing existing socket:", socket.id);
    return socket; // ← still returns, ChatApp will attach listener
  }

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

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket manually disconnected");
  }
}
