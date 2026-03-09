//ChatSidebar.tsx
import { useEffect, useState } from "react";
import { Search, LogOut, Plus, X } from "lucide-react";
import {
  getContactsForList,
  searchContacts,
  deleteDM,
  getAllContacts,
} from "../../contacts/api/contactsApi";
import { apiClient } from "../../../lib/apiClient";
import { useUser } from "../../../context/UserContext";
import { UserAvatar } from "../../../components/UserAvatar";

export function ChatSidebar({
  selectedUser,
  onSelectUser,
  unreadCounts = {},
  isOnline,
}: any) {
  const { user: currentUser, setUser } = useUser();
  const [contacts, setContacts] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ New chat modal state
  const [showNewChat, setShowNewChat] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allUsersSearch, setAllUsersSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      const data = await getContactsForList();
      const normalized = data.map((c: any) => ({
        label: `${c.firstName} ${c.lastName}`.trim(),
        value: c._id,
        color: c.color,
        lastMessageTime: c.lastMessageTime,
      }));
      setContacts(normalized);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Load all users when modal opens
  async function openNewChat() {
    setShowNewChat(true);
    setAllUsersSearch("");
    setLoadingUsers(true);
    try {
      const data = await getAllContacts();
      setAllUsers(data); // [{label, value}]
    } finally {
      setLoadingUsers(false);
    }
  }

  // ✅ Start a new DM — just select the user and open chat
  function handleStartDM(contact: {
    label: string;
    value: string;
    color?: any;
  }) {
    onSelectUser(contact);
    setShowNewChat(false);
    // Add to contacts list if not already there
    setContacts((prev) => {
      const exists = prev.some((c) => c.value === contact.value);
      return exists ? prev : [contact, ...prev];
    });
  }

  const filteredAllUsers = allUsers.filter((u) =>
    u.label?.toLowerCase().includes(allUsersSearch.toLowerCase()),
  );

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const results = await searchContacts(searchTerm);
        const normalized = results.map((c: any) => ({
          label: `${c.firstName} ${c.lastName}`.trim(),
          value: c._id,
          color: c.color,
        }));
        setSearchResults(normalized);
      } catch {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleLogout = async () => {
    try {
      await apiClient.post("/api/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleDeleteDM = async (contactValue: string) => {
    try {
      await deleteDM(contactValue);
      setContacts((prev) => prev.filter((c) => c.value !== contactValue));
      if (selectedUser?.value === contactValue) onSelectUser(null);
    } catch (err) {
      console.error("Delete DM failed:", err);
    }
  };

  const displayList = searchTerm.trim() ? searchResults : contacts;

  return (
    <nav
      aria-label="Conversations"
      className="flex h-full flex-col border-r border-border bg-sidebar"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h1 className="text-lg font-semibold">Messages</h1>
        <div className="flex items-center gap-1">
          {/* ✅ New chat button */}
          <button
            type="button"
            onClick={openNewChat}
            className="rounded-lg p-2 text-foreground/70 hover:bg-accent hover:text-foreground transition-colors"
            aria-label="New conversation"
            title="New conversation"
          >
            <Plus size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg p-2 text-foreground/70 hover:bg-accent hover:text-red-500 transition-colors"
            aria-label="Logout"
          >
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="border-b border-border px-4 py-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/70"
            size={16}
            aria-hidden="true"
          />
          <label htmlFor="search-contacts" className="sr-only">
            Search conversations
          </label>
          <input
            id="search-contacts"
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm placeholder:text-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading && (
          <div className="p-4 text-sm text-foreground/70">Loading...</div>
        )}
        {!loading && displayList.length === 0 && (
          <div className="p-4 text-sm text-foreground/70 text-center">
            {searchTerm ? "No users found" : "No conversations yet"}
          </div>
        )}
        {displayList.map((contact) => {
          const unread = unreadCounts[contact.value] ?? 0;
          const showOnlineDot =
            typeof isOnline === "function" && isOnline(contact.value);
          return (
            <div
              key={contact.value}
              className={`group w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                selectedUser?.value === contact.value
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  onSelectUser(contact);
                  setSearchTerm("");
                  setSearchResults([]);
                }}
                className="flex items-center gap-3 text-left min-w-0 flex-1"
                aria-label={`Open conversation with ${contact.label}`}
              >
                <div className="relative">
                  <UserAvatar
                    userId={contact.value}
                    label={contact.label}
                    color={contact.color}
                  />
                  {showOnlineDot && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-medium text-sm truncate ${unread > 0 ? "font-bold" : ""}`}
                    >
                      {contact.label}
                    </span>
                    {contact.lastMessageTime && (
                      <span
                        className={`text-xs ml-2 flex-shrink-0 ${unread > 0 ? "text-primary font-semibold" : "text-foreground/70"}`}
                      >
                        {new Date(contact.lastMessageTime).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {unread > 0 && (
                <span
                  className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-white"
                  aria-label={`${unread > 99 ? "99+" : unread} unread messages`}
                >
                  {unread > 99 ? "99+" : unread}
                </span>
              )}

              {!searchTerm && unread === 0 && (
                <button
                  type="button"
                  aria-label={`Delete conversation with ${contact.label}`}
                  onClick={() => handleDeleteDM(contact.value)}
                  className="opacity-0 group-hover:opacity-100 text-foreground/70 hover:text-red-500 transition-opacity p-1 rounded"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Current user footer */}
      {currentUser && (
        <div className="border-t border-border px-4 py-3 flex items-center gap-3">
          <UserAvatar
            userId={currentUser.id}
            label={currentUser.firstName}
            color={currentUser.color}
            size={8}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">
              {currentUser.firstName} {currentUser.lastName}
            </p>
            <p className="text-xs text-foreground/70 truncate">
              {currentUser.email}
            </p>
          </div>
          <button
            type="button"
            aria-label="Logout"
            onClick={handleLogout}
            className="text-foreground/70 hover:text-red-500 transition-colors p-1"
          >
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* ✅ New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="font-semibold text-foreground">
                New Conversation
              </h2>
              <button
                type="button"
                onClick={() => setShowNewChat(false)}
                aria-label="Close"
                className="rounded-lg p-1.5 text-foreground/70 hover:bg-accent"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search inside modal */}
            <div className="px-4 py-3 border-b border-border">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/70"
                  size={16}
                />
                <label htmlFor="new-chat-search" className="sr-only">
                  Search users
                </label>
                <input
                  id="new-chat-search"
                  type="text"
                  placeholder="Search users..."
                  value={allUsersSearch}
                  onChange={(e) => setAllUsersSearch(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm placeholder:text-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring/20"
                  autoFocus
                />
              </div>
            </div>

            {/* User list */}
            <div className="max-h-72 overflow-y-auto p-2">
              {loadingUsers && (
                <div className="p-4 text-sm text-foreground/70 text-center">
                  Loading...
                </div>
              )}
              {!loadingUsers && filteredAllUsers.length === 0 && (
                <div className="p-4 text-sm text-foreground/70 text-center">
                  No users found
                </div>
              )}
              {filteredAllUsers.map((u) => (
                <button
                  key={u.value}
                  type="button"
                  onClick={() => handleStartDM(u)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors text-left"
                  aria-label={`Start conversation with ${u.label}`}
                >
                  <UserAvatar label={u.label} color={u.color} />
                  <span className="text-sm font-medium truncate">
                    {u.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
