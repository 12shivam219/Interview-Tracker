import { cookies } from "next/headers";
import { currentAccount } from "@/lib/account";
import { interviewDb } from "@/lib/interview-db";
import { encryptRefreshToken, googleConnectedRedirect, googleOAuthConfig } from "@/lib/google-oauth";

type GoogleTokenResponse = {
  access_token?: string;
  refresh_token?: string;
};

export async function GET(request: Request) {
  const user = await currentAccount();
  if (!user || user.role !== "owner") return googleConnectedRedirect("error");

  const callbackUrl = new URL(request.url);
  const params = callbackUrl.searchParams;
  const stateCookie = (await cookies()).get("google-oauth-state")?.value;
  if (!stateCookie || stateCookie !== params.get("state") || params.has("error")) {
    return googleConnectedRedirect("error");
  }

  try {
    const config = googleOAuthConfig();
    const code = params.get("code");
    if (!code) return googleConnectedRedirect("error");

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
        grant_type: "authorization_code",
      }),
      cache: "no-store",
    });
    if (!tokenResponse.ok) throw new Error("Google token exchange failed");
    const tokens = await tokenResponse.json() as GoogleTokenResponse;
    if (!tokens.access_token) throw new Error("Google did not return an access token");

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
      cache: "no-store",
    });
    if (!profileResponse.ok) throw new Error("Google profile lookup failed");
    const profile = await profileResponse.json() as { email?: string; email_verified?: boolean };
    if (!profile.email || !profile.email_verified) throw new Error("Google account email is not verified");

    const db = interviewDb();
    const existing = await db.prepare(
      "SELECT refresh_token_ciphertext, refresh_token_iv FROM google_connections WHERE id = ?",
    ).bind("gmail").first<{ refresh_token_ciphertext: string; refresh_token_iv: string }>();
    if (!tokens.refresh_token && !existing) throw new Error("Google did not return a refresh token");
    const encrypted = tokens.refresh_token
      ? await encryptRefreshToken(tokens.refresh_token)
      : { ciphertext: existing!.refresh_token_ciphertext, iv: existing!.refresh_token_iv };

    await db.prepare(
      "INSERT INTO google_connections (id, email, refresh_token_ciphertext, refresh_token_iv, connected_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET email = excluded.email, refresh_token_ciphertext = excluded.refresh_token_ciphertext, refresh_token_iv = excluded.refresh_token_iv, connected_at = excluded.connected_at",
    ).bind("gmail", profile.email.toLowerCase(), encrypted.ciphertext, encrypted.iv, new Date().toISOString()).run();

    return googleConnectedRedirect("connected");
  } catch (error) {
    console.error("Google OAuth callback failed", error instanceof Error ? error.name : "unexpected");
    return googleConnectedRedirect("error");
  }
}