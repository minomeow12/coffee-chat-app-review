import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { User } from "../types";
import { fetchUserInfo } from "../features/auth/api/authApi";
import { apiClient } from "../lib/apiClient";
import { initializeSocket, disconnectSocket } from "../lib/socketClient";

type UserCtx = {
  user: User | null;
  setUser: (u: User | null) => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserCtx | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Refresh user session (used on app load + after login)
  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const u = await fetchUserInfo();
      console.log("userinfo (parsed user):", u);
      setUser(u ?? null);
    } catch (err) {
      console.log("userinfo failed:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Logout function
  const logout = async () => {
    try {
      await apiClient.post("/api/auth/logout");
    } catch {
      // ignore backend error
    } finally {
      setUser(null);
      disconnectSocket();
    }
  };

  // 🔹 Bootstrap session on first load
  useEffect(() => {
    void refreshUser();
  }, []);

  // 🔹 Socket lifecycle tied to auth state
  useEffect(() => {
    if (user) {
      initializeSocket();
    } else {
      disconnectSocket();
    }
  }, [user]);

  const value = useMemo(
    () => ({ user, setUser, isLoading, refreshUser, logout }),
    [user, isLoading],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within UserProvider");
  }
  return ctx;
}
