import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  updateCourse,
  deleteCourse,
  createModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../../actions";
import VideoUpload from "./VideoUpload";

type Lesson = {
  id: string;
  title: string;
  description: string;
  bunny_video_id: string | null;
  sort: number;
};

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, slug, description, cover_url, is_published, sort")
    .eq("id", id)
    .single();
  if (!course) notFound();

  const { data: modules } = await supabase
    .from("modules")
    .select("id, title, sort, lessons(id, title, description, bunny_video_id, sort)")
    .eq("course_id", course.id)
    .order("sort");

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/kurse" className="mb-6 inline-block text-xs text-ink2 hover:text-ink">
        ← Alle Kurse
      </Link>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-black tracking-tight">{course.title}</h1>
        {course.is_published && (
          <Link href={`/kurs/${course.slug}`} className="btn-ghost btn-sm shrink-0">
            Ansehen ↗
          </Link>
        )}
      </div>

      {/* Kurs-Einstellungen */}
      <form action={updateCourse.bind(null, course.id)} className="card mb-10 space-y-4 p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-ink3">Einstellungen</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Titel</label>
            <input className="input" name="title" defaultValue={course.title} required />
          </div>
          <div>
            <label className="label">Slug (URL)</label>
            <input className="input" name="slug" defaultValue={course.slug} required />
          </div>
        </div>
        <div>
          <label className="label">Beschreibung</label>
          <textarea className="input" name="description" rows={3} defaultValue={course.description} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Cover-Bild-URL (optional)</label>
            <input className="input" name="cover_url" defaultValue={course.cover_url ?? ""} placeholder="https://…" />
          </div>
          <div>
            <label className="label">Sortierung</label>
            <input className="input" name="sort" type="number" defaultValue={course.sort} />
          </div>
        </div>
        <label className="flex items-center gap-2.5 text-sm">
          <input type="checkbox" name="is_published" defaultChecked={course.is_published} className="h-4 w-4 accent-[#fe2c55]" />
          Veröffentlicht (für Nutzer im Katalog sichtbar)
        </label>
        <div className="flex justify-between pt-1">
          <button className="btn btn-sm">Speichern</button>
        </div>
      </form>

      {/* Module & Lektionen */}
      <h2 className="mb-4 text-lg font-bold">Module & Lektionen</h2>
      <div className="space-y-6">
        {(modules ?? []).map((m) => {
          const lessons = [...((m.lessons as Lesson[]) ?? [])].sort((a, b) => a.sort - b.sort);
          return (
            <div key={m.id} className="card p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="font-bold">{m.title}</h3>
                <form action={deleteModule.bind(null, course.id, m.id)}>
                  <button className="text-xs text-ink3 transition hover:text-accent">
                    Modul löschen
                  </button>
                </form>
              </div>

              <div className="space-y-2.5">
                {lessons.map((l) => (
                  <details key={l.id} className="rounded-xl border border-line bg-bg3/50">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3.5">
                      <span className="min-w-0 truncate text-sm font-semibold">{l.title}</span>
                      <span className={`shrink-0 text-[0.6rem] font-bold uppercase tracking-wider ${l.bunny_video_id ? "text-emerald-400" : "text-ink3"}`}>
                        {l.bunny_video_id ? "● Video" : "○ Kein Video"}
                      </span>
                    </summary>
                    <div className="space-y-4 border-t border-line p-4">
                      <form action={updateLesson.bind(null, course.id, l.id)} className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-[1fr_90px]">
                          <div>
                            <label className="label">Titel</label>
                            <input className="input" name="title" defaultValue={l.title} required />
                          </div>
                          <div>
                            <label className="label">Sort.</label>
                            <input className="input" name="sort" type="number" defaultValue={l.sort} />
                          </div>
                        </div>
                        <div>
                          <label className="label">Beschreibung</label>
                          <textarea className="input" name="description" rows={2} defaultValue={l.description} />
                        </div>
                        <div>
                          <label className="label">Bunny-Video-ID (wird beim Upload automatisch gesetzt)</label>
                          <input className="input font-mono text-xs" name="bunny_video_id" defaultValue={l.bunny_video_id ?? ""} placeholder="z.B. 1a2b3c4d-…" />
                        </div>
                        <button className="btn btn-sm">Lektion speichern</button>
                      </form>
                      <div className="flex items-center justify-between border-t border-line pt-4">
                        <VideoUpload lessonId={l.id} lessonTitle={l.title} hasVideo={!!l.bunny_video_id} />
                        <form action={deleteLesson.bind(null, course.id, l.id)}>
                          <button className="text-xs text-ink3 transition hover:text-accent">
                            Lektion löschen
                          </button>
                        </form>
                      </div>
                    </div>
                  </details>
                ))}
              </div>

              <form action={createLesson.bind(null, course.id, m.id)} className="mt-4 flex gap-2.5">
                <input className="input flex-1" name="title" placeholder="Neue Lektion …" required />
                <input className="input w-20" name="sort" type="number" placeholder="Sort." defaultValue={lessons.length + 1} />
                <button className="btn-ghost btn-sm shrink-0">+ Lektion</button>
              </form>
            </div>
          );
        })}
      </div>

      <form action={createModule.bind(null, course.id)} className="card mt-6 flex gap-2.5 p-5">
        <input className="input flex-1" name="title" placeholder="Neues Modul, z.B. „Grundlagen“ …" required />
        <input className="input w-20" name="sort" type="number" placeholder="Sort." defaultValue={(modules?.length ?? 0) + 1} />
        <button className="btn shrink-0">+ Modul</button>
      </form>

      <div className="mt-12 border-t border-line pt-6">
        <form action={deleteCourse.bind(null, course.id)}>
          <button className="text-xs text-ink3 transition hover:text-accent">
            ⚠ Kurs unwiderruflich löschen (inkl. Module, Lektionen & Zugänge)
          </button>
        </form>
      </div>
    </div>
  );
}
