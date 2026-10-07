"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false); const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const form = new FormData(event.currentTarget);
    const result = await authClient.requestPasswordReset({ email: String(form.get("email") || ""), redirectTo: "/reset-password" });
    if (result.error) setError(result.error.message || "Could not request a reset."); else setSent(true);
  }
  return <main className="authPage"><div className="authCard"><Link href="/" className="brand"><span className="brandMark">L</span>Launchic</Link><h1>Reset your password.</h1>{sent ? <><p>Check your email for a password reset link.</p><Link href="/login" className="button primary">Back to log in</Link></> : <form onSubmit={submit}><label>Email<input name="email" type="email" required placeholder="you@example.com"/></label>{error && <div className="formError">{error}</div>}<button className="button primary">Send reset link</button></form>}{!sent && <p className="authFoot"><Link href="/login">Back to log in</Link></p>}</div></main>;
}
