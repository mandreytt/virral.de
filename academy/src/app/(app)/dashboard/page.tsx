import Link from "next/link";
import { getSessionProfile } from "@/lib/supabase/server";

type CourseRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_url: string | null;
  sort: number;
};

export default async function DashboardPage() {
  const { supabase, user, profile } = await getSessionProfile();

  const [{ data: courses }, { data: enrollments }, { data: progress }] =
    await Promise.all([
      supabase
        .from("courses")
        .select("id, title, slug, description, cover_url, sort")
        .order("sort"),
      supabase.from("enrollments").select("course_id").eq("user_id", user!.id),
      supabase.from("lesson_progress").select("lesson_id").eq("user_id", user!.id),
    ]);

  const enrolledIds = new Set((enrollments ?? []).map((e) => e.course_id));
  const isAdmin = profile!.role === "admin";
  const doneLessons = new Set((progress ?? []).map((p) => p.lesson_id));

  // Lektionen pro Kurs zählen (RLS liefert nur Kurse mit Zugang)
  const { data: lessonRows } = await supabase
    .from("modules")
    .select("course_id, lessons(id)");
  const lessonsByCourse = new Map<string, string[]>();
  for (const m of lessonRows ?? []) {
    const list = lessonsByCourse.get(m.course_id) ?? [];
    for (const l of (m.lessons as { id: string }[]) ?? []) list.push(l.id);
    lessonsByCourse.set(m.course_id, list);
  }

  const myCourses = (courses ?? []).filter(
    (c: CourseRow) => isAdmin || enrolledIds.has(c.id)
  );
  const lockedCourses = (courses ?? []).filter(
    (c: CourseRow) => !isAdmin && !enrolledIds.has(c.id)
  );

  return (
    <div>
      <span className="tag mb-4">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
        virral Academy
      </span>
      <h1 className="mb-2 text-3xl font-black tracking-tight">
        Hey {profile!.full_name?.split(" ")[0] || "du"} 👋
      </h1>
      <p className="mb-10 max-w-xl text-sm text-ink2">
        Hier findest du alle Kurse, die für dich freigeschaltet sind.
      </p>

      {myCourses.length === 0 && (
        <div className="card p-10 text-center">
          <p className="mb-2 text-lg font-bold">Noch keine Kurse freigeschaltet</p>
          <p className="text-sm text-ink2">
            Dein Konto ist aktiv – sobald das virral-Team dir einen Kurs
            zuweist, erscheint er hier.
          </p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {myCourses.map((c: CourseRow) => {
          const lessonIds = lessonsByCourse.get(c.id) ?? [];
          const done = lessonIds.filter((id) => doneLessons.has(id)).length;
          const pct = lessonIds.length
            ? Math.round((done / lessonIds.length) * 100)
            : 0;
          return (
            <Link
              key={c.id}
              href={`/kurs/${c.slug}`}
              className="card group flex flex-col overflow-hidden transition hover:border-line2"
            >
              <div className="relative aspect-video bg-bg3">
                {c.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.cover_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl font-black text-ink3/40">
                    virral<span className="text-accent/40">.</span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="mb-1.5 font-bold leading-snug transition group-hover:text-accent">
                  {c.title}
                </h2>
                <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-ink2">
                  {c.description}
                </p>
                <div className="mt-auto">
                  <div className="mb-1.5 flex justify-between text-[0.65rem] font-semibold text-ink3">
                    <span>{lessonIds.length} Lektionen</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {lockedCourses.length > 0 && (
        <>
          <h2 className="mb-4 mt-14 text-lg font-bold">Weitere Kurse</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lockedCourses.map((c: CourseRow) => (
              <div key={c.id} className="card p-5 opacity-60">
                <h3 className="mb-1.5 font-bold">{c.title} 🔒</h3>
                <p className="mb-4 line-clamp-2 text-xs text-ink2">{c.description}</p>
                <a
                  href={`mailto:hi@virral.de?subject=Zugang zur virral Academy: ${encodeURIComponent(c.title)}`}
                  className="btn-ghost btn-sm"
                >
                  Zugang anfragen
                </a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
