import Tracker from "./tracker";import {currentAccount} from "@/lib/account";import {redirect} from "next/navigation";
export const dynamic="force-dynamic";
type PageProps={searchParams:Promise<{google?:string}>};
async function Workspace({searchParams}:PageProps){const user=await currentAccount();if(!user)redirect("/login");const {google}=await searchParams;return <Tracker account={user} googleStatus={google}/>;}
export default function Page(props:PageProps){return <Workspace {...props}/>;}
