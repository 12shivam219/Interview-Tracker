import { currentAccount, sameOrigin } from "@/lib/account";
import { interviewDb } from "@/lib/interview-db";
import { decryptRefreshToken } from "@/lib/google-oauth";

export async function POST(request: Request) {
  const user = await currentAccount();
  if (!user || user.role !== "owner") {
    return Response.json({ error: "Owner access required" }, { status: 403 });
  }
  if (!sameOrigin(request)) {
    return Response.json({ error: "Invalid request" }, { status: 403 });
  }
  const db = interviewDb();
  const connection = await db.prepare(
    "SELECT refresh_token_ciphertext, refresh_token_iv FROM google_connections WHERE id = ?",
  ).bind("gmail").first<{ refresh_token_ciphertext: string; refresh_token_iv: string }>();
  if (connection) {
    const refreshToken = await decryptRefreshToken(
      connection.refresh_token_ciphertext,
      connection.refresh_token_iv,
    );
    await fetch("https://oauth2.googleapis.com/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token: refreshToken }),
      cache: "no-store",
    }).catch(() => undefined);
  }
  await db.prepare("DELETE FROM google_connections WHERE id = ?").bind("gmail").run();
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}