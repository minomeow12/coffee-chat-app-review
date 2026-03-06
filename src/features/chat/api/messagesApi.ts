import { apiClient } from "../../../lib/apiClient";

export async function getMessages(contactorId: string) {
  console.log("Sending contactorId:", contactorId);

  const { data } = await apiClient.post("/api/messages/get-messages", {
    id: contactorId,
  });

  return data.messages;
}
