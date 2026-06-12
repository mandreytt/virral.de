import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/supabase/server";
import { createBunnyVideo, getTusUploadAuth } from "@/lib/bunny";

/**
 * Legt ein leeres Video bei Bunny an und liefert die Signatur,
 * mit der der Browser die Datei direkt zu Bunny hochlädt (TUS).
 */
export async function POST(request: Request) {
  const { profile } = await getSessionProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403 });
  }

  const { title } = (await request.json()) as { title?: string };
  if (!title?.trim()) {
    return NextResponse.json({ error: "Titel fehlt." }, { status: 400 });
  }

  try {
    const videoId = await createBunnyVideo(title.trim());
    return NextResponse.json(getTusUploadAuth(videoId));
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload-Fehler" },
      { status: 500 }
    );
  }
}
