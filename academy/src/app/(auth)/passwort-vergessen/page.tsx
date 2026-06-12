"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(
      String(form.get("email")),
      { redirectTo: `${window.location.origin}/auth/confirm?next=/passwort-aendern` }
    );
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <>
        <h1 className="mb-3 text-2xl font-extrabold tracking-tight">E-Mail unterwegs</h1>
        <p className="text-sm leading-relaxed text-ink2">
          Falls ein Konto mit dieser Adresse existiert, haben wir dir einen
          Link zum Zurücksetzen des Passworts geschickt.
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="mb-1 text-2xl font-extrabold tracking-tight">Passwort vergessen</h1>
      <p className="mb-7 text-sm text-ink2">
        Wir schicken dir einen Link zum Zurücksetzen.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">E-Mail</label>
          <input className="input" id="email" name="email" type="email" required autoComplete="email" />
        </div>
        {error && <p className="text-sm text-accent">{error}</p>}
        <button className="btn w-full" disabled={loading}>
          {loading ? "Einen Moment …" : "Link anfordern"}
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-ink2">
        <Link href="/login" className="hover:text-ink">Zurück zum Login</Link>
      </p>
    </>
  );
}
