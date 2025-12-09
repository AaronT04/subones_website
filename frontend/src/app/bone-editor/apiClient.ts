type Json = Record<string, unknown> | unknown[] | null;

function isBrowser() {
  return typeof window !== "undefined" && typeof window.document !== "undefined";
}

function resolveUrl(url: string): string {
  try { new URL(url); return url; } catch {}
  const envBase = (process.env.NEXT_PUBLIC_API_BASE || process.env.API_BASE || "").trim();
  if (envBase) return `${envBase.replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
  if (isBrowser()) return `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
  return `http://localhost:7286${url.startsWith("/") ? "" : "/"}${url}`;
}

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text();
  const maybeJson = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
  if (!res.ok) {
    const detail = typeof maybeJson === "string" ? maybeJson : JSON.stringify(maybeJson);
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${detail || "no body"}`);
  }
  return (typeof maybeJson === "string" ? (maybeJson as unknown as T) : (maybeJson as T));
}

export async function http<T>(
  method: string | undefined,
  url: string,
  body?: Json,
  init?: RequestInit
): Promise<T> {
  const m = (method || "GET").toUpperCase();
  const absUrl = resolveUrl(url);
  const headers = new Headers(init?.headers);

  let finalBody: BodyInit | undefined = undefined;
  if (m !== "GET" && m !== "HEAD" && body !== undefined && body !== null) {
    const isForm = typeof FormData !== "undefined" && body instanceof FormData;
    const isBlob = typeof Blob !== "undefined" && body instanceof Blob;
    if (isForm || isBlob) {
      finalBody = body as BodyInit;
    } else {
      if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
      finalBody = JSON.stringify(body);
    }
  } else {
    finalBody = undefined;
    if (!finalBody && headers.get("Content-Type") === "application/json") headers.delete("Content-Type");
  }

  const res = await fetch(absUrl, {
    ...init,
    method: m,
    headers,
    body: finalBody,
    cache: init?.cache ?? "no-store",
  });

  return handle<T>(res);
}
