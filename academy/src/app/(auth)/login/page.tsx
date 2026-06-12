"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    if (error) {
      setError("Login fehlgeschlagen. Bitte E-Mail und Passwort prüfen.");
      setLoading(false);
      return;
    }
    router.replace(params.get("weiter") ?? "/dashboard");
    router.refresh();
  }

  return (
    <>
      <h1 className="mb-1 text-2xl font-extrabold tracking-tight">Willkommen zurück</h1>
      <p className="mb-7 text-sm text-ink2">Melde dich in der virral Academy an.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">E-Mail</label>
          <input className="input" id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <label className="label" htmlFor="password">Passwort</label>
          <input className="input" id="password" name="password" type="password" required autoComplete="current-password" />
        </div>
        {error && <p className="text-sm text-accent">{error}</p>}
        <button className="btn w-full" disabled={loading}>
          {loading ? "Einen Moment …" : "Anmelden"}
        </button>
      </form>
      <div className="mt-6 flex justify-between text-xs text-ink2">
        <Link href="/passwort-vergessen" className="hover:text-ink">Passwort vergessen?</Link>
        <Link href="/registrieren" className="hover:text-ink">Konto erstellen</Link>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
