"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/supabase/server";

async function requireAdmin() {
  const { supabase, profile } = await getSessionProfile();
  if (!profile || profile.role !== "admin") {
    throw new Error("Nicht berechtigt.");
  }
  return supabase;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "kurs";
}

// ── Kurse ─────────────────────────────────────────────────────────────
export async function createCourse(formData: FormData) {
  const supabase = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  let slug = slugify(title);
  const { data: existing } = await supabase
    .from("courses").select("id").eq("slug", slug).maybeSingle();
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const { data, error } = await supabase
    .from("courses")
    .insert({ title, slug })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  revalidatePath("/admin/kurse");
  redirect(`/admin/kurse/${data.id}`);
}

export async function updateCourse(courseId: string, formData: FormData) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("courses")
    .update({
      title: String(formData.get("title") ?? "").trim(),
      slug: slugify(String(formData.get("slug") ?? formData.get("title") ?? "")),
      description: String(formData.get("description") ?? ""),
      cover_url: String(formData.get("cover_url") ?? "").trim() || null,
      is_published: formData.get("is_published") === "on",
      sort: Number(formData.get("sort") ?? 0),
    })
    .eq("id", courseId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/kurse/${courseId}`);
  revalidatePath("/dashboard");
}

export async function deleteCourse(courseId: string) {
  const supabase = await requireAdmin();
  await supabase.from("courses").delete().eq("id", courseId);
  revalidatePath("/admin/kurse");
  redirect("/admin/kurse");
}

// ── Module ────────────────────────────────────────────────────────────
export async function createModule(courseId: string, formData: FormData) {
  const supabase = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  const sort = Number(formData.get("sort") ?? 0);
  await supabase.from("modules").insert({ course_id: courseId, title, sort });
  revalidatePath(`/admin/kurse/${courseId}`);
}

export async function deleteModule(courseId: string, moduleId: string) {
  const supabase = await requireAdmin();
  await supabase.from("modules").delete().eq("id", moduleId);
  revalidatePath(`/admin/kurse/${courseId}`);
}

// ── Lektionen ─────────────────────────────────────────────────────────
export async function createLesson(
  courseId: string,
  moduleId: string,
  formData: FormData
) {
  const supabase = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  await supabase.from("lessons").insert({
    module_id: moduleId,
    title,
    description: String(formData.get("description") ?? ""),
    sort: Number(formData.get("sort") ?? 0),
  });
  revalidatePath(`/admin/kurse/${courseId}`);
}

export async function updateLesson(
  courseId: string,
  lessonId: string,
  formData: FormData
) {
  const supabase = await requireAdmin();
  await supabase
    .from("lessons")
    .update({
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? ""),
      sort: Number(formData.get("sort") ?? 0),
      bunny_video_id: String(formData.get("bunny_video_id") ?? "").trim() || null,
    })
    .eq("id", lessonId);
  revalidatePath(`/admin/kurse/${courseId}`);
}

export async function deleteLesson(courseId: string, lessonId: string) {
  const supabase = await requireAdmin();
  await supabase.from("lessons").delete().eq("id", lessonId);
  revalidatePath(`/admin/kurse/${courseId}`);
}

/** Wird nach erfolgreichem TUS-Upload aus dem Browser aufgerufen. */
export async function setLessonVideo(lessonId: string, videoId: string) {
  const supabase = await requireAdmin();
  await supabase
    .from("lessons")
    .update({ bunny_video_id: videoId })
    .eq("id", lessonId);
  revalidatePath("/admin/kurse");
}

// ── Nutzer & Zugänge ──────────────────────────────────────────────────
export async function grantAccess(userId: string, formData: FormData) {
  const { supabase, profile } = await getSessionProfile();
  if (!profile || profile.role !== "admin") throw new Error("Nicht berechtigt.");
  const courseId = String(formData.get("course_id") ?? "");
  if (!courseId) return;
  await supabase
    .from("enrollments")
    .upsert({ user_id: userId, course_id: courseId, granted_by: profile.id });
  revalidatePath("/admin/nutzer");
}

export async function revokeAccess(userId: string, courseId: string) {
  const supabase = await requireAdmin();
  await supabase
    .from("enrollments")
    .delete()
    .eq("user_id", userId)
    .eq("course_id", courseId);
  revalidatePath("/admin/nutzer");
}

export async function setRole(userId: string, role: "member" | "admin") {
  const supabase = await requireAdmin();
  await supabase.from("profiles").update({ role }).eq("id", userId);
  revalidatePath("/admin/nutzer");
}
