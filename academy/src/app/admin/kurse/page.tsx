import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createCourse } from "../actions";

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, slug, is_published, sort, modules(id, lessons(id))")
    .order("sort");

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-3xl font-black tracking-tight">Kurse</h1>

      <form action={createCourse} className="card mb-8 flex gap-3 p-5">
        <input
          className="input flex-1"
          name="title"
          placeholder="Titel des neuen Kurses, z.B. „TikTok Growth Masterclass“"
          required
        />
        <button className="btn shrink-0">+ Kurs anlegen</button>
      </form>

      <div className="card divide-y divide-white/5">
        {(courses ?? []).map((c) => {
          const lessonCount = (c.modules as { lessons: { id: string }[] }[])
            .reduce((n, m) => n + (m.lessons?.length ?? 0), 0);
          return (
            <Link
              key={c.id}
              href={`/admin/kurse/${c.id}`}
              className="group flex items-center justify-between gap-4 p-4 transition hover:bg-white/[0.02]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold transition group-hover:text-accent">
                  {c.title}
                </p>
                <p className="text-xs text-ink3">
                  /{c.slug} · {lessonCount} Lektionen
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${
                  c.is_published
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-white/5 text-ink3"
                }`}
              >
                {c.is_published ? "Live" : "Entwurf"}
              </span>
            </Link>
          );
        })}
        {(courses ?? []).length === 0 && (
          <p className="p-6 text-sm text-ink3">Noch keine Kurse – leg oben den ersten an.</p>
        )}
      </div>
    </div>
  );
}
