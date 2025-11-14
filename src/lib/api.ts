const API_BASE =
  import.meta.env.VITE_API_BASE || "https://api.nexuscores.app";

const API_KEY = import.meta.env.VITE_API_KEY || "dev_api_key_123";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
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

  let data = null;

  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const msg = data?.error || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
