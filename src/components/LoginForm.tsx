import React, { useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  loginWithEmailPassword,
  registerWithEmailPassword,
  type EmailPasswordPayload,
} from "../core/coreClient";

export type AuthMode = "login" | "register";

export type NativeFormProps = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  "onSubmit" | "onError"
>;

export interface LoginFormProps extends NativeFormProps {
  mode?: AuthMode;
  onSuccess?(data: unknown): void;
  onError?(error: Error): void;
}




export function LoginForm({
  mode = "login",
  className,
  onSuccess,
  onError,
  ...formProps
}: LoginFormProps) {
  const [values, setValues] = useState<EmailPasswordPayload>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const title =
    mode === "login" ? "Sign in to Nexus" : "Create your Nexus account";
  const subtitle =
    mode === "login"
      ? "Enter your credentials to access the Cosmos Map."
      : "Use your email and a password to create an account.";
  const buttonLabel = loading
    ? "Please wait…"
    : mode === "login"
    ? "Sign in"
    : "Create account";

  const handleChange =
    (field: keyof EmailPasswordPayload) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const payload: EmailPasswordPayload = {
        email: values.email.trim(),
        password: values.password,
      };

      const data =
        mode === "login"
          ? await loginWithEmailPassword(payload)
          : await registerWithEmailPassword(payload);

      onSuccess?.(data);
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error");
      setErrorMessage(err.message);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn(
        "flex w-full max-w-sm flex-col gap-6 rounded-2xl bg-black/80 px-6 py-8 text-white shadow-2xl",
        "border border-white/5 backdrop-blur",
        className
      )}
      onSubmit={handleSubmit}
      {...formProps}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground text-slate-400">
          {subtitle}
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={values.email}
            onChange={handleChange("email")}
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {mode === "login" && (
              <span className="text-xs text-slate-400">
                {/* сюда потом повесим ссылку "Forgot password?" */}
              </span>
            )}
          </div>
          <Input
            id="password"
            type="password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            required
            value={values.password}
            onChange={handleChange("password")}
          />
        </div>

        {errorMessage && (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {errorMessage}
          </div>
        )}

        <Button
          type="submit"
          className="mt-1 w-full"
          disabled={loading || !values.email || !values.password}
        >
          {buttonLabel}
        </Button>

        {/* Кнопка провайдера оставлена "как слот" под будущее OAuth */}
        <Button
          type="button"
          variant="outline"
          className="w-full border-white/10 bg-transparent text-slate-200 hover:bg-white/5"
        >
          Continue with provider
        </Button>
      </div>
    </form>
  );
}
