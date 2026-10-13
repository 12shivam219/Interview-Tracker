import { applicationUrl } from "./account";

export function googleOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    applicationUrl("/api/google/callback").toString();
  if (!clientId || !clientSecret) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured");
  }
  return { clientId, clientSecret, redirectUri };
}

async function encryptionKey() {
  const configuredKey = process.env.GOOGLE_TOKEN_ENCRYPTION_KEY;
  const rawKey = configuredKey ? Buffer.from(configuredKey, "base64") : null;
  if (!rawKey || rawKey.length !== 32) {
    throw new Error("GOOGLE_TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key");
  }
  return crypto.subtle.importKey("raw", rawKey, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function encryptRefreshToken(token: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    await encryptionKey(),
    new TextEncoder().encode(token),
  );
  return {
    ciphertext: Buffer.from(ciphertext).toString("base64"),
    iv: Buffer.from(iv).toString("base64"),
  };
}

export async function decryptRefreshToken(ciphertext: string, iv: string) {
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: Buffer.from(iv, "base64") },
    await encryptionKey(),
    Buffer.from(ciphertext, "base64"),
  );
  return new TextDecoder().decode(plaintext);
}

export function clearGoogleStateCookie(response: Response) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.headers.append(
    "Set-Cookie",
    `google-oauth-state=; HttpOnly; SameSite=Lax; Path=/api/google/callback; Max-Age=0${secure}`,
  );
}

export function googleConnectedRedirect(result: "connected" | "error") {
  const url = applicationUrl("/");
  url.searchParams.set("google", result);
  const response = new Response(null, {
    status: 303,
    headers: { Location: url.toString() },
  });
  clearGoogleStateCookie(response);
  return response;
}