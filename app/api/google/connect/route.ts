import { currentAccount } from "@/lib/account";
import { randomToken } from "@/lib/password-crypto";
import { googleOAuthConfig } from "@/lib/google-oauth";

export async function GET() {
  const user = await currentAccount();
  if (!user || user.role !== "owner") {
    return Response.json({ error: "Owner access required" }, { status: 403 });
  }

  try {
    const config = googleOAuthConfig();
    const state = randomToken();
    const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authorizationUrl.search = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: "code",
      scope: "openid email https://www.googleapis.com/auth/gmail.readonly",
      access_type: "offline",
      prompt: "consent",
      state,
    }).toString();

    const response = new Response(null, {
      status: 302,
      headers: { Location: authorizationUrl.toString() },
    });
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    response.headers.append(
      "Set-Cookie",
      `google-oauth-state=${state}; HttpOnly; SameSite=Lax; Path=/api/google/callback; Max-Age=600${secure}`,
    );
    return response;
  } catch (error) {
    console.error("Google OAuth configuration failed", error instanceof Error ? error.message : "unexpected");
    return Response.json({ error: "Google OAuth is not configured" }, { status: 503 });
  }
}