"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: String(form.get("password")),
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <>
      <h1 className="mb-1 text-2xl font-extrabold tracking-tight">Neues Passwort</h1>
      <p className="mb-7 text-sm text-ink2">Lege ein neues Passwort fest.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="password">Neues Passwort</label>
          <input className="input" id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
        </div>
        {error && <p className="text-sm text-accent">{error}</p>}
        <button className="btn w-full" disabled={loading}>
          {loading ? "Einen Moment …" : "Passwort speichern"}
        </button>
      </form>
    </>
  );
}
