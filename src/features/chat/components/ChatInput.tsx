import { useState } from "react";
import { getSocket } from "../../../lib/socketClient";
import { useUser } from "../../../context/UserContext";

export function ChatInput({ user, setMessages }: any) {
  const [message, setMessage] = useState("");
  const { user: currentUser } = useUser();

  if (!user) return null;

  const handleSend = () => {
    if (!message.trim()) return;
    if (!currentUser?.id) return;

    const socket = getSocket();
    if (!socket) return;

    const newMessage = {
      _id: Date.now().toString(),
      sender: currentUser.id,
      recipient: user.value,
      content: message,
      timestamp: new Date().toISOString(),
    };

    // Optimistically update UI
    setMessages((prev: any) => [...prev, newMessage]);

    socket.emit("sendMessage", {
      sender: currentUser.id,
      recipient: user.value,
      content: message,
      messageType: "text",
    });

    setMessage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-border flex gap-2"
    >
      <input
        className="flex-1 rounded-xl border px-3 py-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />

      <button
        type="submit"
        className="px-4 py-2 bg-primary text-white rounded-xl"
      >
        Send
      </button>
    </form>
  );
}
