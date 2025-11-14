export interface EmailPasswordPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string | null;
}

export interface SessionResponse {
  user: AuthUser | null;
}

const CORE_API_BASE: string =
  (import.meta as any).env?.VITE_CORE_API_BASE ?? "http://localhost:3000";

function buildUrl(path: string): string {
  return CORE_API_BASE.replace(/\/$/, "") + path;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(buildUrl(path), {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(data?.message || `Request failed: ${res.status}`);
  }

  return data as T;
}

// ---- AUTH API ----
export function loginWithEmailPassword(payload: EmailPasswordPayload) {
  return request("/auth/login/email-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function registerWithEmailPassword(payload: EmailPasswordPayload) {
  return request("/auth/register/email-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchSession() {
  return request<SessionResponse>("/auth/session", { method: "GET" });
}

export function logout() {
  return request("/auth/logout", { method: "POST", body: "{}" });
}
