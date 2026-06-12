"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as tus from "tus-js-client";
import { setLessonVideo } from "../../actions";

export default function VideoUpload({
  lessonId,
  lessonTitle,
  hasVideo,
}: {
  lessonId: string;
  lessonTitle: string;
  hasVideo: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onFile(file: File) {
    setError(null);
    setProgress(0);

    const res = await fetch("/api/bunny/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: lessonTitle }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Upload konnte nicht gestartet werden.");
      setProgress(null);
      return;
    }
    const auth = (await res.json()) as {
      endpoint: string;
      signature: string;
      expiration: number;
      libraryId: string;
      videoId: string;
    };

    const upload = new tus.Upload(file, {
      endpoint: auth.endpoint,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        AuthorizationSignature: auth.signature,
        AuthorizationExpire: String(auth.expiration),
        VideoId: auth.videoId,
        LibraryId: auth.libraryId,
      },
      metadata: { filetype: file.type, title: lessonTitle },
      onError: (err) => {
        setError(`Upload fehlgeschlagen: ${err.message}`);
        setProgress(null);
      },
      onProgress: (sent, total) => {
        setProgress(Math.round((sent / total) * 100));
      },
      onSuccess: async () => {
        await setLessonVideo(lessonId, auth.videoId);
        setProgress(null);
        router.refresh();
      },
    });
    upload.start();
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
      {progress === null ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="btn-ghost btn-sm"
        >
          {hasVideo ? "Video ersetzen" : "🎬 Video hochladen"}
        </button>
      ) : (
        <div className="w-48">
          <div className="mb-1 flex justify-between text-[0.65rem] font-semibold text-ink3">
            <span>Lädt hoch …</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      {error && <p className="mt-2 text-xs text-accent">{error}</p>}
    </div>
  );
}
