import {cookies} from "next/headers";
import {interviewDb} from "./interview-db";
import {digest,equalHash} from "./password-crypto";
export function ownerEmail(){const value=process.env.OWNER_EMAIL?.trim().toLowerCase();if(!value)throw new Error("OWNER_EMAIL must be configured");return value;}
export function applicationUrl(path:string){const value=process.env.APP_URL;if(!value)throw new Error("APP_URL must be configured");const base=new URL(value);if(!["https:","http:"].includes(base.protocol)||base.username||base.password)throw new Error("APP_URL must be an HTTP or HTTPS URL");return new URL(path,base);}
export type Account={id:string;email:string;name:string;role:"owner"|"editor"|"viewer"};
export async function currentAccount():Promise<Account|null>{const c=await cookies();const token=c.get("__Host-interview-session")?.value;if(!token||!/^[a-f0-9]{64}$/.test(token))return null;return await interviewDb().prepare("SELECT a.id,a.email,a.name,a.role FROM accounts a JOIN sessions s ON a.id = s.account_id WHERE s.hash = ? AND s.expires > ? AND a.enabled = '1'").bind(await digest(token),new Date().toISOString()).first<Account>();}
export function serviceAuthorized(req:Request){const v=process.env.SYNC_SERVICE_TOKEN;const h=req.headers.get("x-interview-sync-key");return !!v&&!!h&&equalHash(v,h);}
export function sameOrigin(req:Request){return req.headers.get("origin")===new URL(req.url).origin;}
export function authPepper(){const value=process.env.AUTH_PEPPER;if(!value)throw new Error("AUTH_PEPPER must be configured");return value;}
export const sessionCookie=(token:string,age=604800)=>`__Host-interview-session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${age}`;
