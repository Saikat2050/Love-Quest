"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useProgress } from "@/components/progress-provider";
import { ENDING, NAMES } from "@/content/game";

export function EndingPlaceholder() {
  const router = useRouter();
  const { ready, cityUnlocked, finish, progress, reset } = useProgress();

  useEffect(() => {
    if (ready && !cityUnlocked && !progress.finished) {
      router.replace("/");
    }
  }, [cityUnlocked, progress.finished, ready, router]);

  useEffect(() => {
    if (ready && cityUnlocked && !progress.finished) {
      finish();
    }
  }, [cityUnlocked, finish, progress.finished, ready]);

  if (!ready || (!cityUnlocked && !progress.finished)) {
    return <div className="min-h-dvh" />;
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center px-5 py-16">
      <p className="font-display text-[11px] tracking-[0.2em] text-emerald-glow uppercase">
        The city opens
      </p>
      <h1 className="mt-3 font-display text-3xl tracking-wide text-parchment">
        A scroll for {NAMES.her}
      </h1>
      <p className="mt-2 font-script text-3xl text-brick-warm">and for {NAMES.nickname}</p>

      <article className="parchment-card mt-8 rounded-sm px-5 py-8">
        <p className="font-display text-[11px] tracking-[0.16em] text-brick-deep uppercase">
          {ENDING.placeholder}
        </p>
        <p className="mt-4 font-letter text-lg leading-8">
          Here the photograph will rest, and a letter will unfold like a
          scroll. The seven gates behind you will stay closed. This is the
          last room of the quest.
        </p>
      </article>

      <button
        type="button"
        onClick={() => {
          reset();
          router.replace("/");
        }}
        className="mt-10 font-display text-[10px] tracking-[0.24em] text-mist/70 uppercase"
      >
        Begin the road again
      </button>
    </main>
  );
}
