const COOKIE_NAME = "admin_session";

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(s: string): Uint8Array | null {
  try {
    const pad = s.length % 4 === 0 ? 0 : 4 - (s.length % 4);
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  const raw = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(secret),
  );
  return crypto.subtle.importKey(
    "raw",
    raw,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSessionToken(
  payload: { exp: number },
  secret: string,
): Promise<string> {
  const data = new TextEncoder().encode(JSON.stringify(payload));
  const key = await hmacKey(secret);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, data));
  const dataB64 = bytesToBase64Url(data);
  const sigB64 = bytesToBase64Url(sig);
  return `${dataB64}.${sigB64}`;
}

export async function verifySessionToken(
  token: string,
  secret: string,
): Promise<boolean> {
  const [dataB64, sigB64] = token.split(".");
  if (!dataB64 || !sigB64) return false;
  const data = base64UrlToBytes(dataB64);
  const sig = base64UrlToBytes(sigB64);
  if (!data || !sig) return false;
  const key = await hmacKey(secret);
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    sig as BufferSource,
    data as BufferSource,
  );
  if (!ok) return false;
  try {
    const payload = JSON.parse(new TextDecoder().decode(data)) as {
      exp?: number;
    };
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}
