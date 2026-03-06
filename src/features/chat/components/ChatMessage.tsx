import { useEffect, useRef } from "react";
import { getMessages } from "../api/messagesApi";
import { useUser } from "../../../context/UserContext";

export function ChatMessage({ user, messages, setMessages }: any) {
  const { user: currentUser } = useUser();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user?.value) return;
    setMessages([]);
    let isMounted = true;

    async function loadMessages() {
      try {
        const data = await getMessages(user.value);
        const loadedMessages = Array.isArray(data)
          ? data
          : (data?.messages ?? []);
        console.log("📨 Loaded messages:", loadedMessages);
        if (isMounted) setMessages(loadedMessages);
      } catch (err) {
        console.error("❌ Failed to load messages:", err);
        if (isMounted) setMessages([]);
      }
    }

    loadMessages();
    return () => {
      isMounted = false;
    };
  }, [user?.value]);

  const selectedId = user?.value;
  const myId = currentUser?.id;
  console.log(
    "🧪 raw msg sender:",
    JSON.stringify(messages[messages.length - 1], null, 2),
  );

  const filteredMessages = Array.isArray(messages)
    ? messages.filter((msg: any) => {
        const senderId =
          typeof msg.sender === "object"
            ? msg.sender?._id || msg.sender?.id
            : msg.sender;

        const recipientId =
          typeof msg.recipient === "object"
            ? msg.recipient?._id || msg.recipient?.id
            : msg.recipient;

        // 🔍 ADD THIS
        console.log("🔍 filter check:", {
          senderId,
          recipientId,
          myId,
          selectedId,
          match:
            (senderId === myId && recipientId === selectedId) ||
            (senderId === selectedId && recipientId === myId),
        });

        return (
          selectedId &&
          ((senderId === myId && recipientId === selectedId) ||
            (senderId === selectedId && recipientId === myId))
        );
      })
    : [];

  // 🔍 Debug — remove after fixing
  console.log("🧪 myId:", myId, "| selectedId:", selectedId);
  console.log("🧪 all messages:", messages);
  console.log("🧪 filteredMessages:", filteredMessages);
  console.log("🧪 first message raw:", JSON.stringify(messages[0], null, 2));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center">
        Select a conversation
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4 overflow-y-auto h-full">
      {filteredMessages.map((msg: any) => {
        const senderId = msg.sender?._id || msg.sender?.id || msg.sender;
        const isMine = senderId === currentUser?.id;
        const msgKey = msg._id ?? msg.id ?? `${msg.timestamp}-${msg.content}`;

        return (
          <div
            key={msgKey}
            className={`max-w-xs rounded-xl px-4 py-2 ${
              isMine
                ? "bg-primary text-white self-end"
                : "bg-secondary self-start"
            }`}
          >
            {msg.content}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
