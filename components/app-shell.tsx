"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
const nav=[["/","Overview"],["/brain","Business Brain"],["/scout","Scout"],["/launchpad","Launchpad"],["/meter","Meter"]];
export function AppShell({children}:{children:React.ReactNode}){const p=usePathname();return <div className="shell"><header><Link href="/" className="brand"><span className="mark">l</span>launchic</Link><nav>{nav.map(([href,label])=><Link key={href} href={href} className={p===href||href!=="/"&&p.startsWith(href)?"active":""}>{label}</Link>)}</nav><span className="workspace">Acme Workspace</span><span className="avatar">A</span></header><main>{children}</main></div>}