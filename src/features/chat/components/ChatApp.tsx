// ChatApp.tsx
import { useState, useEffect, useRef } from "react";
import { ChatSidebar } from "./ChatSidebar";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { initializeSocket, setMessageHandler } from "../../../lib/socketClient";
import { useUser } from "../../../context/UserContext";
import { MessageCircle } from "lucide-react";
import { ChatHeader } from "./ChatHeader";

export function ChatApp() {
  const { user: currentUser } = useUser();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [lastSeen, setLastSeen] = useState<Record<string, number>>({});
  const [readMap, setReadMap] = useState<Record<string, boolean>>({});

  const setMessagesRef = useRef(setMessages);
  const currentUserRef = useRef<any>(null);
  const selectedUserRef = useRef<any>(null);

  useEffect(() => {
    setMessagesRef.current = setMessages;
  });
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.id) return;

    initializeSocket(currentUser.id);

    setMessageHandler((msg: any) => {
      const senderId =
        typeof msg.sender === "object"
          ? msg.sender?._id || msg.sender?.id
          : msg.sender;
      const recipientId =
        typeof msg.recipient === "object"
          ? msg.recipient?._id || msg.recipient?.id
          : msg.recipient;

      if (senderId) {
        setLastSeen((prev) => ({ ...prev, [senderId]: Date.now() }));
      }

      if (senderId && selectedUserRef.current?.value !== senderId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] ?? 0) + 1,
        }));
      }

      setMessagesRef.current((prev: any[]) => {
        const msgId = msg._id ?? msg.id;
        if (msgId && prev.some((m) => (m._id ?? m.id) === msgId)) return prev;

        if (msg.localKey) {
          const idx = prev.findIndex(
            (m) => m.localKey && m.localKey === msg.localKey,
          );
          if (idx !== -1) {
            const copy = [...prev];
            copy[idx] = { ...msg };
            return copy;
          }
        }

        const idx = prev.findIndex((m) => {
          const msender =
            typeof m.sender === "object"
              ? m.sender?._id || m.sender?.id
              : m.sender;
          const mrecipient =
            typeof m.recipient === "object"
              ? m.recipient?._id || m.recipient?.id
              : m.recipient;
          const t1 = new Date(m.timestamp ?? 0).getTime();
          const t2 = new Date(msg.timestamp ?? 0).getTime();
          return (
            msender === senderId &&
            mrecipient === recipientId &&
            m.content === msg.content &&
            Math.abs(t2 - t1) < 3000
          );
        });

        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = { ...msg };
          return copy;
        }

        return [...prev, msg];
      });
    });

    return () => {
      setMessageHandler(() => {});
    };
  }, [currentUser?.id]);

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    selectedUserRef.current = user;
    setMessages([]);
    setReadMap((prev) => {
      const updated = { ...prev };
      messages.forEach((m) => {
        const id = m._id ?? m.id;
        if (id) updated[id] = true;
      });
      return updated;
    });
    if (window.innerWidth < 768) setIsSidebarOpen(false);
    if (user?.value) setUnreadCounts((prev) => ({ ...prev, [user.value]: 0 }));
  };

  const isOnline = (userId: string) =>
    Date.now() - (lastSeen[userId] ?? 0) < 30000;

  return (
    <main className="flex h-screen overflow-hidden">
      <aside
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-30 w-72 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex-shrink-0`}
      >
        <ChatSidebar
          selectedUser={selectedUser}
          onSelectUser={handleSelectUser}
          unreadCounts={unreadCounts}
          isOnline={isOnline}
        />
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <section className="flex flex-1 flex-col overflow-hidden">
        {selectedUser ? (
          <ChatHeader
            selectedUser={selectedUser}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isOnline={isOnline}
          />
        ) : (
          <ChatHeader
            selectedUser={selectedUser}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isOnline={isOnline}
          />
        )}

        {selectedUser ? (
          <>
            <div className="flex-1 overflow-y-auto min-h-0">
              <ChatMessage
                user={selectedUser}
                messages={messages}
                setMessages={setMessages}
                readMap={readMap}
              />
            </div>
            <ChatInput user={selectedUser} setMessages={setMessages} />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center bg-muted/30">
            <div className="text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-accent p-6">
                <MessageCircle size={32} className="text-accent-foreground" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                Select a conversation
              </h3>
              <p className="text-sm text-foreground/70">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
