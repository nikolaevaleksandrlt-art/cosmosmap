import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string | null;
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  async function refresh() {
    try {
      // /auth/me в твоём API
      const session = await apiFetch("/auth/me", { method: "GET" });

      const u =
        (session as any)?.user ??
        (session as any) ??
        null; // подстраховка под разные форматы

      setUser(u);
      setStatus(u ? "authenticated" : "unauthenticated");
    } catch {
      setUser(null);
      setStatus("unauthenticated");
    }
  }

  async function signOut() {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
        body: JSON.stringify({}),
      });
    } finally {
      setUser(null);
      setStatus("unauthenticated");
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ status, user, refresh, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
