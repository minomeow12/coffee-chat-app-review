import { apiClient } from "../../../lib/apiClient";

export async function searchContacts(searchTerm: string) {
  const { data } = await apiClient.post("/api/contacts/search", {
    searchTerm,
  });
  return data.contacts;
}

export async function getAllContacts() {
  const { data } = await apiClient.get("/api/contacts/all-contacts");
  return data.contacts;
}

export async function getContactsForList() {
  const { data } = await apiClient.get("/api/contacts/get-contacts-for-list");
  return data.contacts;
}

export async function deleteDM(dmId: string) {
  const { data } = await apiClient.delete(`/api/contacts/delete-dm/${dmId}`);
  return data;
}
