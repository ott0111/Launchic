import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
export const metadata: Metadata = { title: "Launchic — Find What to Build. Know What to Do Next.", description: "Launchic helps you discover opportunities, validate ideas, launch faster, and grow what works." };
export default function RootLayout({children}:{children:ReactNode}){return <html lang="en"><body>{children}</body></html>}