export const hex=(v:ArrayBuffer|Uint8Array)=>Array.from(new Uint8Array(v),b=>b.toString(16).padStart(2,"0")).join("");
export const randomToken=()=>hex(crypto.getRandomValues(new Uint8Array(32)));
export async function digest(s:string){return hex(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)));}
export async function passwordHash(password:string,salt:string,pepper:string){if(!pepper)throw new Error("Password service unavailable");const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password+"\0"+pepper),"PBKDF2",false,["deriveBits"]);return hex(await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:new TextEncoder().encode(salt),iterations:100000},key,256));}
export function equalHash(a:string,b:string){if(a.length!==b.length)return false;let difference=0;for(let i=0;i<a.length;i++)difference|=a.charCodeAt(i)^b.charCodeAt(i);return difference===0;}
