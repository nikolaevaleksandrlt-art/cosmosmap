// src/lib/api.ts

const API_BASE = (
  import.meta.env.VITE_API_BASE || "https://api.nexuscores.app/api"
).replace(/\/$/, ""); // на всякий случай срежем хвостовой "/"

const API_KEY = import.meta.env.VITE_API_KEY || "dev_api_key_123";

export async function apiFetch(path: string, options: RequestInit = {}) {
  // гарантируем, что путь начинается с "/"
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${API_BASE}${normalizedPath}`, {
    method: options.method || "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": API_KEY,
      ...(options.headers || {}),
    },
    body: options.body,
    mode: "cors",
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const msg = data?.error || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
