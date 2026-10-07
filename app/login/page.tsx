"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Login() {
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    const form = new FormData(event.currentTarget);
    const result = await authClient.signIn.email({ email: String(form.get("email") || ""), password: String(form.get("password") || ""), callbackURL: "/app" });
    if (result.error) { setError(result.error.message || "Invalid email or password."); setLoading(false); return; }
    window.location.href = "/app";
  }
  return <main className="authPage"><div className="authCard"><Link href="/" className="brand"><span className="brandMark">L</span>Launchic</Link><h1>Welcome back.</h1><p>Sign in to continue building.</p><form onSubmit={submit}><label>Email<input name="email" type="email" required placeholder="you@example.com" autoComplete="email"/></label><label>Password<input name="password" type="password" required placeholder="••••••••" autoComplete="current-password"/></label><div className="authRow"><Link href="/forgot-password">Forgot password?</Link></div>{error && <div className="formError">{error}</div>}<button className="button primary" type="submit" disabled={loading}>{loading ? "Signing in..." : "Log in"}</button></form><p className="authFoot">Don't have an account? <Link href="/signup">Create one</Link></p></div></main>;
}
