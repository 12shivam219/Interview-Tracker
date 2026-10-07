import {cookies} from "next/headers";
import {env} from "cloudflare:workers";
import {interviewDb} from "./interview-db";
import {digest,equalHash} from "./password-crypto";
export const OWNER_EMAIL="12shivamtiwari219@gmail.com";
export type Account={id:string;email:string;name:string;role:"owner"|"editor"|"viewer"};
export async function currentAccount():Promise<Account|null>{const c=await cookies();const token=c.get("__Host-interview-session")?.value;if(!token||!/^[a-f0-9]{64}$/.test(token))return null;return await interviewDb().prepare("SELECT a.id,a.email,a.name,a.role FROM accounts a JOIN sessions s ON a.id = s.account_id WHERE s.hash = ? AND s.expires > ? AND a.enabled = '1'").bind(await digest(token),new Date().toISOString()).first<Account>();}
export function serviceAuthorized(req:Request){const v=(env as unknown as {SYNC_SERVICE_TOKEN?:string}).SYNC_SERVICE_TOKEN;const h=req.headers.get("x-interview-sync-key");return !!v&&!!h&&equalHash(v,h);}
export function sameOrigin(req:Request){return req.headers.get("origin")===new URL(req.url).origin;}
export function authPepper(){return (env as unknown as {AUTH_PEPPER?:string}).AUTH_PEPPER||"";}
export const sessionCookie=(token:string,age=604800)=>`__Host-interview-session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${age}`;
