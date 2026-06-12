"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: String(form.get("email")),
      password: String(form.get("password")),
      options: {
        data: { full_name: String(form.get("full_name")) },
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=/dashboard`,
      },
    });
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
        <h1 className="mb-3 text-2xl font-extrabold tracking-tight">Fast geschafft!</h1>
        <p className="text-sm leading-relaxed text-ink2">
          Wir haben dir eine E-Mail geschickt. Bitte bestätige deine Adresse,
          um dein Konto zu aktivieren. Deine Kurszugänge werden anschließend
          vom virral-Team freigeschaltet.
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="mb-1 text-2xl font-extrabold tracking-tight">Konto erstellen</h1>
      <p className="mb-7 text-sm text-ink2">
        Nach der Registrierung schaltet das virral-Team deine Kurse frei.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="full_name">Name</label>
          <input className="input" id="full_name" name="full_name" type="text" required autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="email">E-Mail</label>
          <input className="input" id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <label className="label" htmlFor="password">Passwort</label>
          <input className="input" id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
          <p className="mt-1.5 text-xs text-ink3">Mindestens 8 Zeichen.</p>
        </div>
        {error && <p className="text-sm text-accent">{error}</p>}
        <button className="btn w-full" disabled={loading}>
          {loading ? "Einen Moment …" : "Registrieren"}
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-ink2">
        Schon ein Konto?{" "}
        <Link href="/login" className="font-semibold text-ink hover:text-accent">Anmelden</Link>
      </p>
    </>
  );
}
