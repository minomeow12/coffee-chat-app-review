// src/features/auth/api/authApi.ts
import { apiClient } from "../../../lib/apiClient";

export async function fetchUserInfo() {
  const res = await apiClient.get("/api/auth/userinfo");
  const data = res.data;

  // handle both {user:{...}} and direct user object
  const u = data?.user ?? data;

  if (!u || typeof u !== "object") return null;
  return u;
}

export async function logout() {
  await apiClient.post("/api/auth/logout");
}
