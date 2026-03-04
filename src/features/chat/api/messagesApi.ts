import { apiClient } from "../../../lib/apiClient";

export async function getMessages(contactorId: string) {
  const { data } = await apiClient.post("/api/messages/get-messages", {
    id: contactorId,
  });
  return data.messages;
}
