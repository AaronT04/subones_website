// src/lib/apiClient.ts
type Json = Record<string, unknown> | unknown[] | null;

const BASE = "http://localhost:7286";

/** ensure absolute URL and ensure it begins with /api */
function buildUrl(input: string): string {
  try { new URL(input); return input; } catch {/* not absolute */}
  const path = input.startsWith("/api/") ? input : `/api/${input.replace(/^\/+/, "")}`;
  return `${BASE}${path}`;
}

async function parseJson<T>(res: Response, url: string): Promise<T> {
  const text = await res.text();
  const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
  if (!res.ok) {
    const detail = typeof data === "string" ? data.slice(0, 300) : JSON.stringify(data);
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${url}\n${detail || "no body"}`);
  }
  return data as T;
}

export async function http<T>(
  method: string,
  url: string,
  body?: Json,
  init?: RequestInit
): Promise<T> {
  const m = (method || "GET").toUpperCase();
  const abs = buildUrl(url);
  const headers = new Headers(init?.headers);

  let finalBody: BodyInit | undefined;
  if (m !== "GET" && m !== "HEAD" && body != null) {
    if (typeof FormData !== "undefined" && body instanceof FormData) {
      finalBody = body as BodyInit; // let browser set boundary
    } else {
      if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
      finalBody = JSON.stringify(body);
    }
  } else {
    if (headers.get("Content-Type") === "application/json") headers.delete("Content-Type");
  }

  const res = await fetch(abs, { ...init, method: m, headers, body: finalBody, cache: "no-store" });
  return parseJson<T>(res, abs);
}

export const api = {
  get:  <T>(url: string, init?: RequestInit) => http<T>("GET", url, undefined, init),
  post: <T>(url: string, body?: Json, init?: RequestInit) => http<T>("POST", url, body, init),
  put:  <T>(url: string, body?: Json, init?: RequestInit) => http<T>("PUT", url, body, init),
  del:  <T>(url: string, init?: RequestInit) => http<T>("DELETE", url, undefined, init),
};
