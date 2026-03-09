// ChatMessage.tsx
import { useEffect, useRef } from "react";
import { getMessages } from "../api/messagesApi";
import { useUser } from "../../../context/UserContext";

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    date.toLocaleDateString([], { month: "short", day: "numeric" }) +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

function groupMessagesByDate(messages: any[]) {
  const groups: { date: string; messages: any[] }[] = [];
  messages.forEach((msg) => {
    const date = new Date(msg.timestamp).toDateString();
    const last = groups[groups.length - 1];
    if (last && last.date === date) last.messages.push(msg);
    else groups.push({ date, messages: [msg] });
  });
  return groups;
}

function formatDateLabel(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) return "Today";

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString([], {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ChatMessage({ user, messages, setMessages, readMap }: any) {
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
        if (isMounted) setMessages(loadedMessages);
      } catch {
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

        return (
          selectedId &&
          ((senderId === myId && recipientId === selectedId) ||
            (senderId === selectedId && recipientId === myId))
        );
      })
    : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center text-foreground/70">
        Select a conversation
      </div>
    );
  }

  if (filteredMessages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-foreground/70 py-12">
        <div className="text-4xl">👋</div>
        <p className="text-sm font-medium">No messages yet</p>
        <p className="text-xs">Say hello to {user.label}!</p>
      </div>
    );
  }

  const grouped = groupMessagesByDate(filteredMessages);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto px-4 py-4 gap-1">
      {grouped.map((group) => (
        <div key={group.date}>
          {/* Date separator */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-foreground/70 px-2 flex-shrink-0">
              {formatDateLabel(group.date)}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="flex flex-col gap-1">
            {group.messages.map((msg: any, i: number) => {
              const senderId =
                typeof msg.sender === "object"
                  ? msg.sender?._id || msg.sender?.id
                  : msg.sender;

              const isMine = senderId === myId;
              const msgId = msg._id ?? msg.id;
              const msgKey = msgId ?? `${msg.timestamp}-${msg.content}`;

              // Group consecutive messages
              const prevMsg = group.messages[i - 1];
              const prevSenderId = prevMsg
                ? typeof prevMsg.sender === "object"
                  ? prevMsg.sender?._id || prevMsg.sender?.id
                  : prevMsg.sender
                : null;

              const isFirstInGroup = prevSenderId !== senderId;

              // Last message in group
              const nextMsg = group.messages[i + 1];
              const nextSenderId = nextMsg
                ? typeof nextMsg.sender === "object"
                  ? nextMsg.sender?._id || nextMsg.sender?.id
                  : nextMsg.sender
                : null;

              const isLastInGroup = nextSenderId !== senderId;

              return (
                <div
                  key={msgKey}
                  className={`flex ${
                    isMine ? "justify-end" : "justify-start"
                  } ${isFirstInGroup ? "mt-2" : "mt-0.5"}`}
                  style={{ animation: "fadeSlideIn 0.15s ease-out" }}
                >
                  <div
                    className={`flex flex-col ${
                      isMine ? "items-end" : "items-start"
                    } max-w-[75%] md:max-w-[60%]`}
                  >
                    <div
                      className={`px-4 py-2 text-sm leading-relaxed break-words ${
                        isMine
                          ? "bg-primary text-white rounded-2xl rounded-br-md"
                          : "bg-card text-foreground rounded-2xl rounded-bl-md border border-border"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Timestamp + receipt only on last in group */}
                    {isLastInGroup && msg.timestamp && (
                      <div className="flex items-center gap-1 mt-1 px-1">
                        <span className="text-xs text-foreground/70">
                          {formatTime(msg.timestamp)}
                        </span>

                        {isMine && msgId && (
                          <span className="text-[10px] text-foreground/60">
                            {readMap?.[msgId] ? "✔✔" : "✔"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div ref={bottomRef} />

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
