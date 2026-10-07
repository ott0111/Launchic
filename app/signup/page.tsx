"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Signup() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    const form = new FormData(event.currentTarget);
    const result = await authClient.signUp.email({
      name: String(form.get("name") || ""), email: String(form.get("email") || ""),
      password: String(form.get("password") || ""), callbackURL: "/onboarding",
    });
    if (result.error) { setError(result.error.message || "Could not create your account."); setLoading(false); return; }
    window.location.href = "/onboarding";
  }
  return <main className="authPage"><div className="authCard"><Link href="/" className="brand"><span className="brandMark">L</span>Launchic</Link><h1>Start building.</h1><p>Create your Launchic workspace and find your next move.</p><form onSubmit={submit}><label>Name<input name="name" required placeholder="Your name" autoComplete="name"/></label><label>Email<input name="email" type="email" required placeholder="you@example.com" autoComplete="email"/></label><label>Password<input name="password" type="password" required minLength={8} placeholder="At least 8 characters" autoComplete="new-password"/></label>{error && <div className="formError">{error}</div>}<button className="button primary" type="submit" disabled={loading}>{loading ? "Creating account..." : "Create account"}</button></form><p className="authFoot">Already have an account? <Link href="/login">Log in</Link></p></div></main>;
}
