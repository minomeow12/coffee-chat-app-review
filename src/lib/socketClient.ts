import { io, Socket } from "socket.io-client";
import { SERVER_URL } from "./apiClient";

let socket: Socket | null = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(SERVER_URL, {
      withCredentials: true,
      extraHeaders: {
        "ngrok-skip-browser-warning": "true",
      },
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
