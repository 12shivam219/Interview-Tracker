import { env } from "cloudflare:workers";
export function interviewDb() { if (!env.DB) throw new Error("Interview storage unavailable"); return env.DB; }
