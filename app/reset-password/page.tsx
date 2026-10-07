"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function ResetPassword() {
  const [error, setError] = useState(""); const [done, setDone] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const form = new FormData(event.currentTarget);
    const result = await authClient.resetPassword({ newPassword: String(form.get("password") || "") });
    if (result.error) setError(result.error.message || "Could not reset your password."); else setDone(true);
  }
  return <main className="authPage"><div className="authCard"><Link href="/" className="brand"><span className="brandMark">L</span>Launchic</Link>{done ? <><h1>Password updated.</h1><p>You can now sign in with your new password.</p><Link href="/login" className="button primary">Log in</Link></> : <><h1>Choose a new password.</h1><form onSubmit={submit}><label>New password<input name="password" type="password" required minLength={8} placeholder="At least 8 characters"/></label>{error && <div className="formError">{error}</div>}<button className="button primary">Update password</button></form></>}</div></main>;
}
