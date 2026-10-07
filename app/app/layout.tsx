import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
export default async function AppLayout({children}:{children:React.ReactNode}){const s=await auth.api.getSession({headers:await headers()});if(!s)redirect("/login");return <div className="workspaceShell"><header className="workspaceHeader"><Link href="/app" className="brand"><span className="brandMark">L</span>Launchic</Link><nav className="pillNav"><Link href="/app">Overview</Link><Link href="/app/scout">Scout</Link><Link href="/app/launchpad">Launchpad</Link><Link href="/app/brain">Business Brain</Link></nav><div className="userPill">{s.user.name||s.user.email}</div></header>{children}</div>}