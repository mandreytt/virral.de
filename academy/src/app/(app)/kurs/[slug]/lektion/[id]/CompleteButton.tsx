"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CompleteButton({
  lessonId,
  initialDone,
}: {
  lessonId: string;
  initialDone: boolean;
}) {
  const [done, setDone] = useState(initialDone);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function toggle() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (done) {
      await supabase
        .from("lesson_progress")
        .delete()
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId);
      setDone(false);
    } else {
      await supabase
        .from("lesson_progress")
        .upsert({ user_id: user.id, lesson_id: lessonId });
      setDone(true);
    }
    startTransition(() => router.refresh());
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={done ? "btn btn-sm" : "btn-ghost btn-sm"}
    >
      {done ? "✓ Erledigt" : "Als erledigt markieren"}
    </button>
  );
}
