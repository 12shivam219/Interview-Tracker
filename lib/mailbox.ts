import { interviewDb } from "./interview-db";
export const mailboxOwner="12shivamtiwari219@gmail.com";
export const mailboxAccount="zeeshan.tech26@gmail.com";
export async function syncSettings(){const row=await interviewDb().prepare("SELECT data FROM mailbox_sync WHERE id = ?").bind("gmail").first<{data:string}>();return row?JSON.parse(row.data):{account:mailboxAccount,enabled:false,scheduleReady:false,lastSync:null};}
