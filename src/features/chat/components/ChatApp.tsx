import { useState, useEffect, useRef } from "react";
import { ChatSidebar } from "./ChatSidebar";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { initializeSocket } from "../../../lib/socketClient";
import { useUser } from "../../../context/UserContext";

export function ChatApp() {
  const { user: currentUser } = useUser();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const handleReceiveRef = useRef<((msg: any) => void) | null>(null);

  useEffect(() => {
    if (!currentUser?.id) return;

    const socket = initializeSocket(currentUser.id);

    // ✅ Remove old listener if exists
    if (handleReceiveRef.current) {
      socket.off("receiveMessage", handleReceiveRef.current);
    }

    // ✅ Create and store stable handler
    const handleReceive = (msg: any) => {
      console.log("🔥 receiveMessage FIRED:", msg);
      setMessages((prev) => {
        const exists = prev.some((m) => m._id && m._id === msg._id);
        return exists ? prev : [...prev, msg];
      });
    };

    handleReceiveRef.current = handleReceive;
    socket.on("receiveMessage", handleReceive);
    console.log(
      "👂 Listener count after attach:",
      socket.listeners("receiveMessage").length,
    );

    return () => {
      socket.off("receiveMessage", handleReceive);
      handleReceiveRef.current = null;
    };
  }, [currentUser?.id]);

  return (
    <div className="flex h-dvh overflow-hidden">
      <ChatSidebar selectedUser={selectedUser} onSelectUser={setSelectedUser} />
      <div className="flex flex-1 flex-col min-h-0">
        <div className="flex-1 overflow-y-auto flex flex-col">
          <ChatMessage
            user={selectedUser}
            messages={messages}
            setMessages={setMessages}
          />
        </div>
        <ChatInput user={selectedUser} setMessages={setMessages} />
      </div>
    </div>
  );
}
