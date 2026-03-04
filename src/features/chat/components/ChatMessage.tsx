import { useEffect, useState } from "react";
import { getMessages } from "../api/messagesApi";

export function ChatMessage({ user }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.value) return;

    async function loadMessages() {
      setLoading(true);
      try {
        const data = await getMessages(user._id);
        setMessages(data);
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Select a conversation
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className="max-w-xs rounded-xl bg-secondary px-4 py-2"
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}
