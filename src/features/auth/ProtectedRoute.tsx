import React, { useEffect } from "react";
import { useAuth } from "./auth-provider";
import { useLocation } from "wouter";

export function ProtectedRoute({ component: Component }: any) {
  const { status } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (status === "unauthenticated") navigate("/login");
  }, [status]);

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center text-white">Checking session…</div>;
  }

  if (status === "unauthenticated") return null;

  return <Component />;
}
