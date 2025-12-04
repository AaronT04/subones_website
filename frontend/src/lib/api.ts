// src/lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7286/";

type Json = Record<string, unknown> | unknown[];

function normalize(path: string) {
  const b = BASE.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

// Helper to get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`[api] ${res.status} ${res.statusText} → ${res.url}\n${text.slice(0, 400)}`);
    throw new Error(`[api] ${res.status} ${res.statusText} — see console`);
  }
  if (res.status === 204) return undefined as unknown as T;
  const raw = await res.text();
  return (raw ? (JSON.parse(raw) as T) : (undefined as unknown as T));
}

async function req<T>(method: string, path: string, init?: RequestInit, body?: unknown) {
  const url = normalize(path);
  const headers = new Headers(init?.headers);

  // Add authentication token if available
  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...init,
    method,
    headers,
    body: body == null ? undefined : JSON.stringify(body)
  });

  return handle<T>(res);
}

export const api = {
  get: <T = Json>(path: string, init?: RequestInit) => req<T>("GET", path, init),
  post: <T = Json>(path: string, body?: unknown, init?: RequestInit) => req<T>("POST", path, init, body),
  put:  <T = Json>(path: string, body?: unknown, init?: RequestInit) => req<T>("PUT", path, init, body),
  del:  <T = Json>(path: string, init?: RequestInit) => req<T>("DELETE", path, init),
};

console.log("NEXT_PUBLIC_API_URL =", BASE);