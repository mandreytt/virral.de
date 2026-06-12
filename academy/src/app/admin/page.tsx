import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const [{ count: users }, { count: courses }, { count: lessons }, { count: enrollments }] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("lessons").select("id", { count: "exact", head: true }),
      supabase.from("enrollments").select("user_id", { count: "exact", head: true }),
    ]);

  const stats = [
    { label: "Nutzer", value: users ?? 0, href: "/admin/nutzer" },
    { label: "Kurse", value: courses ?? 0, href: "/admin/kurse" },
    { label: "Lektionen", value: lessons ?? 0, href: "/admin/kurse" },
    { label: "Vergebene Zugänge", value: enrollments ?? 0, href: "/admin/nutzer" },
  ];

  return (
    <div>
      <h1 className="mb-8 text-3xl font-black tracking-tight">Admin</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-6 transition hover:border-line2">
            <p className="text-3xl font-extrabold tracking-tight">{s.value}</p>
            <p className="mt-1 text-xs text-ink3">{s.label}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex gap-3">
        <Link href="/admin/kurse" className="btn">Kurse verwalten</Link>
        <Link href="/admin/nutzer" className="btn-ghost">Nutzer verwalten</Link>
      </div>
    </div>
  );
}
