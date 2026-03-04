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
    <div className="w-72 border-r border-border bg-sidebar">
      {contacts.map((contact) => (
        <button
          key={contact.value}
          onClick={() => onSelectUser(contact)}
          className={`w-full text-left p-4 hover:bg-muted ${selectedUser?.value == contact.value ? "bg-muted" : ""}`}
        >
          <div className="font-medium">
            {contact.label?.trim() || "Unnamed User"}
          </div>
        </button>
      ))}
    </div>
  );
}
