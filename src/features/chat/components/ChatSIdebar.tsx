import { useEffect, useState } from "react";
import {
  getAllContacts,
  getContactsForList,
} from "../../contacts/api/contactsApi";

export function ChatSidebar({ selectedUser, onSelectUser }: any) {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContacts() {
      try {
        const data = await getAllContacts();
        setContacts(data);
      } finally {
        setLoading(false);
      }
    }
    loadContacts();
  }, []);

  if (loading) return <div className="p-4">Loading contacts...</div>;

  return (
    <div className="w-64 border-r border-border flex flex-col h-full">
      {/* Optional header */}
      <div className="p-4 border-b border-border">Contacts</div>
      {/* Scrollable contacts list */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => {
          console.log("🧪 contact:", JSON.stringify(contact, null, 2)); // ← add
          return (
            <button
              key={contact.value}
              onClick={() => onSelectUser(contact)}
              className={`w-full text-left p-4 hover:bg-muted ${selectedUser?.value == contact.value ? "bg-muted" : ""}`}
            >
              <div className="font-medium">
                {contact.label?.trim() || "Unnamed User"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
