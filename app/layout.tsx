import type { Metadata } from "next";import "./globals.css";
export const metadata:Metadata={title:"Interview Tracker",description:"Your upcoming interviews and completed conversations, together in one simple place.",icons:{icon:"/favicon.svg"}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
