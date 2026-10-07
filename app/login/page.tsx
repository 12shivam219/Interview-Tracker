import Login from "./login";import {currentAccount} from "@/lib/account";import {redirect} from "next/navigation";
export const dynamic="force-dynamic";
async function LoginPage(){if(await currentAccount())redirect("/");return <Login/>;}
export default function Page(){return <LoginPage/>;}
