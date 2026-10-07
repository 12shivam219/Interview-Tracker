import Tracker from "./tracker";import {currentAccount} from "@/lib/account";import {redirect} from "next/navigation";
export const dynamic="force-dynamic";
async function Workspace(){const user=await currentAccount();if(!user)redirect("/login");return <Tracker account={user}/>;}
export default function Page(){return <Workspace/>;}
