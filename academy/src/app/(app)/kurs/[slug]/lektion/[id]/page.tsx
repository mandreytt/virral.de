import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionProfile } from "@/lib/supabase/server";
import { getSignedEmbedUrl } from "@/lib/bunny";
import CompleteButton from "./CompleteButton";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const { supabase, user } = await getSessionProfile();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, slug")
    .eq("slug", slug)
    .single();
  if (!course) notFound();

  const [{ data: lesson }, { data: modules }, { data: progress }] =
    await Promise.all([
      supabase
        .from("lessons")
        .select("id, title, description, bunny_video_id, module_id")
        .eq("id", id)
        .single(),
      supabase
        .from("modules")
        .select("id, sort, lessons(id, title, sort)")
        .eq("course_id", course.id)
        .order("sort"),
      supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", user!.id)
        .eq("lesson_id", id),
    ]);
  if (!lesson) notFound();

  // Flache, sortierte Lektionsliste für Vor/Zurück-Navigation
  const flat = (modules ?? []).flatMap((m) =>
    [...((m.lessons as { id: string; title: string; sort: number }[]) ?? [])]
      .sort((a, b) => a.sort - b.sort)
  );
  const idx = flat.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;
  const isDone = (progress ?? []).length > 0;

  return (
    <div className="mx-auto max-w-4xl">
      <Link href={`/kurs/${course.slug}`} className="mb-6 inline-block text-xs text-ink2 hover:text-ink">
        ← {course.title}
      </Link>

      <div className="card overflow-hidden">
        {lesson.bunny_video_id ? (
          <div className="relative aspect-video bg-black">
            <iframe
              src={getSignedEmbedUrl(lesson.bunny_video_id)}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title={lesson.title}
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-bg3 text-sm text-ink3">
            Für diese Lektion wurde noch kein Video hochgeladen.
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold tracking-tight">{lesson.title}</h1>
          {lesson.description && (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink2">
              {lesson.description}
            </p>
          )}
        </div>
        <CompleteButton lessonId={lesson.id} initialDone={isDone} />
      </div>

      <div className="mt-10 flex justify-between border-t border-line pt-6 text-sm">
        {prev ? (
          <Link href={`/kurs/${course.slug}/lektion/${prev.id}`} className="btn-ghost btn-sm">
            ← {prev.title}
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/kurs/${course.slug}/lektion/${next.id}`} className="btn btn-sm">
            {next.title} →
          </Link>
        ) : (
          <Link href={`/kurs/${course.slug}`} className="btn btn-sm">
            Kurs abschließen 🎉
          </Link>
        )}
      </div>
    </div>
  );
}
