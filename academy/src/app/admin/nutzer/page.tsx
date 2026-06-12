import { createClient } from "@/lib/supabase/server";
import { grantAccess, revokeAccess, setRole } from "../actions";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const [{ data: users }, { data: courses }, { data: enrollments }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, full_name, role, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("courses").select("id, title").order("sort"),
      supabase.from("enrollments").select("user_id, course_id"),
    ]);

  const courseTitle = new Map((courses ?? []).map((c) => [c.id, c.title]));
  const byUser = new Map<string, string[]>();
  for (const e of enrollments ?? []) {
    byUser.set(e.user_id, [...(byUser.get(e.user_id) ?? []), e.course_id]);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-3xl font-black tracking-tight">Nutzer</h1>
      <p className="mb-8 text-sm text-ink2">
        Hier schaltest du Kurse für einzelne Nutzer frei. Neue Nutzer
        registrieren sich selbst unter <code className="text-ink">/registrieren</code>.
      </p>

      <div className="space-y-4">
        {(users ?? []).map((u) => {
          const userCourses = byUser.get(u.id) ?? [];
          const available = (courses ?? []).filter((c) => !userCourses.includes(c.id));
          return (
            <div key={u.id} className="card p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">
                    {u.full_name || "—"}{" "}
                    {u.role === "admin" && (
                      <span className="ml-1 rounded-full bg-accent/10 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-accent">
                        Admin
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-ink3">{u.email}</p>
                </div>
                <form
                  action={setRole.bind(null, u.id, u.role === "admin" ? "member" : "admin")}
                >
                  <button className="text-[0.65rem] font-semibold text-ink3 transition hover:text-ink">
                    {u.role === "admin" ? "Adminrechte entziehen" : "Zum Admin machen"}
                  </button>
                </form>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {userCourses.map((cid) => (
                  <form key={cid} action={revokeAccess.bind(null, u.id, cid)}>
                    <button
                      className="group inline-flex items-center gap-1.5 rounded-full border border-line2 px-3 py-1 text-xs font-medium transition hover:border-accent/50"
                      title="Zugang entziehen"
                    >
                      {courseTitle.get(cid) ?? "Unbekannter Kurs"}
                      <span className="text-ink3 transition group-hover:text-accent">✕</span>
                    </button>
                  </form>
                ))}
                {userCourses.length === 0 && (
                  <span className="text-xs text-ink3">Keine Kurszugänge</span>
                )}
              </div>

              {available.length > 0 && (
                <form action={grantAccess.bind(null, u.id)} className="mt-3.5 flex gap-2.5">
                  <select name="course_id" className="input flex-1" required defaultValue="">
                    <option value="" disabled>
                      Kurs auswählen …
                    </option>
                    {available.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-sm shrink-0">Freischalten</button>
                </form>
              )}
            </div>
          );
        })}
        {(users ?? []).length === 0 && (
          <div className="card p-6 text-sm text-ink3">Noch keine registrierten Nutzer.</div>
        )}
      </div>
    </div>
  );
}
