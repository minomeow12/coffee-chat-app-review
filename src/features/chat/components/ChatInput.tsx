// ChatInput.tsx
import { useState, useRef, useEffect } from "react";
import { getSocket } from "../../../lib/socketClient";
import { useUser } from "../../../context/UserContext";
import { Send, Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export function ChatInput({ user, setMessages }: any) {
  const [message, setMessage] = useState("");
  const { user: currentUser } = useUser();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmojiSelect = (emoji: any) => {
    const input = inputRef.current;
    if (!input) {
      setMessage((prev) => prev + emoji.native);
      return;
    }
    const start = input.selectionStart ?? message.length;
    const end = input.selectionEnd ?? message.length;
    const newMsg = message.slice(0, start) + emoji.native + message.slice(end);
    setMessage(newMsg);

    setTimeout(() => {
      input.selectionStart = start + emoji.native.length;
      input.selectionEnd = start + emoji.native.length;
      input.focus();
    }, 0);
  };

  if (!user) return null;

  const handleSend = () => {
    if (!message.trim() || !currentUser?.id) return;
    const socket = getSocket();
    if (!socket) return;

    socket.emit("sendMessage", {
      sender: currentUser.id,
      recipient: user.value,
      content: message.trim(),
      messageType: "text",
    });

    setMessage("");
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-card px-3 py-3">
      <div className="flex items-center gap-2">
        {/* Emoji button */}
        <div className="relative flex-shrink-0" ref={pickerRef}>
          <button
            type="button"
            aria-label={
              showEmojiPicker ? "Close emoji picker" : "Open emoji picker"
            }
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className={`p-2 rounded-xl transition-colors ${
              showEmojiPicker
                ? "text-primary bg-accent"
                : "text-foreground/70 hover:text-foreground hover:bg-accent"
            }`}
          >
            <Smile size={20} aria-hidden="true" />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 z-50 shadow-lg rounded-xl overflow-hidden">
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme="light"
                previewPosition="none"
                skinTonePosition="none"
              />
            </div>
          )}
        </div>

        {/* Input */}
        <label htmlFor="message-input" className="sr-only">
          Message {user.label ?? ""}
        </label>

        <input
          ref={inputRef}
          id="message-input"
          className="flex-1 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm placeholder:text-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          value={message}
          onChange={(e) => {
            const value = e.target.value;
            setMessage(value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${user.label ?? ""}...`}
        />

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          aria-label="Send message"
          disabled={!message.trim()}
          className={`flex-shrink-0 p-2.5 rounded-xl transition-all ${
            message.trim()
              ? "bg-primary text-white hover:opacity-90 scale-100"
              : "bg-muted text-foreground/70 cursor-not-allowed"
          }`}
        >
          <Send size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
