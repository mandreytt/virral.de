import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionProfile } from "@/lib/supabase/server";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { supabase, user } = await getSessionProfile();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, slug, description")
    .eq("slug", slug)
    .single();
  if (!course) notFound();

  const [{ data: modules }, { data: progress }] = await Promise.all([
    supabase
      .from("modules")
      .select("id, title, sort, lessons(id, title, description, bunny_video_id, sort)")
      .eq("course_id", course.id)
      .order("sort"),
    supabase.from("lesson_progress").select("lesson_id").eq("user_id", user!.id),
  ]);

  const done = new Set((progress ?? []).map((p) => p.lesson_id));
  const hasAccess = (modules ?? []).length > 0;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard" className="mb-6 inline-block text-xs text-ink2 hover:text-ink">
        ← Alle Kurse
      </Link>
      <h1 className="mb-3 text-3xl font-black tracking-tight">{course.title}</h1>
      <p className="mb-10 text-sm leading-relaxed text-ink2">{course.description}</p>

      {!hasAccess && (
        <div className="card p-10 text-center">
          <p className="mb-2 text-lg font-bold">Kein Zugang 🔒</p>
          <p className="text-sm text-ink2">
            Für diesen Kurs bist du noch nicht freigeschaltet. Melde dich beim
            virral-Team, um Zugang zu erhalten.
          </p>
        </div>
      )}

      <div className="space-y-8">
        {(modules ?? []).map((m, mi) => {
          const lessons = [...((m.lessons as {
            id: string; title: string; description: string;
            bunny_video_id: string | null; sort: number;
          }[]) ?? [])].sort((a, b) => a.sort - b.sort);
          return (
            <section key={m.id}>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-ink3">
                Modul {mi + 1} · {m.title}
              </h2>
              <div className="card divide-y divide-white/5">
                {lessons.map((l, li) => (
                  <Link
                    key={l.id}
                    href={`/kurs/${course.slug}/lektion/${l.id}`}
                    className="group flex items-center gap-4 p-4 transition hover:bg-white/[0.02]"
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        done.has(l.id)
                          ? "bg-accent text-white"
                          : "border border-line2 text-ink3"
                      }`}
                    >
                      {done.has(l.id) ? "✓" : li + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold transition group-hover:text-accent">
                        {l.title}
                      </p>
                      {l.description && (
                        <p className="truncate text-xs text-ink3">{l.description}</p>
                      )}
                    </div>
                    <span className="text-ink3 transition group-hover:text-accent">▶</span>
                  </Link>
                ))}
                {lessons.length === 0 && (
                  <p className="p-4 text-xs text-ink3">Noch keine Lektionen.</p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
