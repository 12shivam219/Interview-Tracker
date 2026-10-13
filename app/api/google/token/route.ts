import { interviewDb } from "@/lib/interview-db";
import { serviceAuthorized } from "@/lib/account";
import { decryptRefreshToken } from "@/lib/google-oauth";

export async function GET(request: Request) {
  if (!serviceAuthorized(request)) {
    return Response.json({ error: "Sync service access required" }, { status: 403 });
  }
  const connection = await interviewDb().prepare(
    "SELECT email, refresh_token_ciphertext, refresh_token_iv FROM google_connections WHERE id = ?",
  ).bind("gmail").first<{
    email: string;
    refresh_token_ciphertext: string;
    refresh_token_iv: string;
  }>();
  if (!connection) {
    return Response.json({ error: "Google account is not connected" }, { status: 404 });
  }
  const refreshToken = await decryptRefreshToken(
    connection.refresh_token_ciphertext,
    connection.refresh_token_iv,
  );
  return Response.json(
    { email: connection.email, refreshToken },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}