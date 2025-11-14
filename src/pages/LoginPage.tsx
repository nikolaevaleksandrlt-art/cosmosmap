import React from "react";
import { AuthPanel } from "@/components/AuthPanel";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <AuthPanel mode="login" redirectTo="/" />
    </div>
  );
}
