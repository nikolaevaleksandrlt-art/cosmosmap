import React from "react";
import { AuthPanel } from "@/components/AuthPanel";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <AuthPanel mode="register" redirectTo="/" />
    </div>
  );
}
