// src/components/AuthPanel.tsx
import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/features/auth/auth-provider";
import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/ui/button";

export type AuthPanelMode = "auto" | "login" | "register";

interface AuthPanelProps {
  mode?: AuthPanelMode;
  redirectTo?: string;
}

export function AuthPanel({
  mode = "auto",
  redirectTo = "/",
}: AuthPanelProps) {
  const {  status, user, refresh, signOut } = useAuth();
  const [, navigate] = useLocation();

  const initialView: "login" | "register" =
    mode === "register" ? "register" : "login";

  const [viewMode, setViewMode] = useState<"login" | "register">(initialView);
  const [busy, setBusy] = useState(false);

  const effectiveMode =
    mode === "auto" ? (viewMode as "login" | "register") : (mode as "login" | "register");

  const handleAuthSuccess = async () => {
    setBusy(true);
    try {
      await refresh();
      navigate(redirectTo);
    } catch (error) {
      console.error("Auth success but failed to refresh session", error);
    } finally {
      setBusy(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-black/80 px-6 py-8 text-white border border-white/10">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        <p className="text-sm text-slate-300">Checking your session…</p>
      </div>
    );
  }

  if (status === "authenticated" && user) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-black/80 px-6 py-8 text-white border border-white/10 shadow-2xl">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-slate-400 uppercase tracking-[0.16em]">
            Signed in
          </p>
          <h1 className="text-xl font-semibold">
            Welcome back,{" "}
            {user.fullName || user.email.split("@")[0] || "Explorer"}
          </h1>
          <p className="text-xs text-slate-400 break-all">{user.email}</p>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <Button
            className="w-full"
            onClick={() => navigate("/")}
          >
            Open dashboard
          </Button>
          <Button
            variant="outline"
            className="w-full border-white/20 text-slate-200 hover:bg-white/10"
            onClick={() => signOut()}
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  // статус "unauthenticated" → показываем формы login/register
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {/* переключатель Login / Register */}
      <div className="flex rounded-full bg-black/60 border border-white/10 p-1 text-xs text-slate-300">
        <button
          type="button"
          className={
            "flex-1 rounded-full px-3 py-1.5 transition " +
            (effectiveMode === "login"
              ? "bg-white text-black"
              : "bg-transparent text-slate-400 hover:text-white")
          }
          onClick={() => setViewMode("login")}
        >
          Sign in
        </button>
        <button
          type="button"
          className={
            "flex-1 rounded-full px-3 py-1.5 transition " +
            (effectiveMode === "register"
              ? "bg-white text-black"
              : "bg-transparent text-slate-400 hover:text-white")
          }
          onClick={() => setViewMode("register")}
        >
          Create account
        </button>
      </div>

      <LoginForm
        mode={effectiveMode}
        onSuccess={handleAuthSuccess}
        onError={(err) => console.error("Auth error:", err)}
        aria-busy={busy}
      />
    </div>
  );
}
