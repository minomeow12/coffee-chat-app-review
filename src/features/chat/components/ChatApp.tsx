import { useState } from "react";
import { ChatSidebar } from "./ChatSidebar";
//import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
//import { ChatInput } from "./ChatInput";

export function ChatApp() {
  const [selectedUser, setSelectedUser] = useState<any>(null);

  return (
    <div className="flex h-dvh">
      <ChatSidebar selectedUser={selectedUser} onSelectUser={setSelectedUser} />
      <div className="flex flex-1 flex-col">
        <ChatMessage user={selectedUser} />
      </div>
    </div>
  );
}
