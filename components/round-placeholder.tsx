"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useProgress } from "@/components/progress-provider";
import { getRound, NAMES, type RoundId } from "@/content/game";

export function RoundPlaceholder({ n }: { n: RoundId }) {
  const router = useRouter();
  const { ready, isUnlocked, complete } = useProgress();
  const round = getRound(n);

  useEffect(() => {
    if (ready && !isUnlocked(n)) {
      router.replace("/");
    }
  }, [isUnlocked, n, ready, router]);

  if (!ready || !isUnlocked(n)) {
    return <div className="min-h-dvh" />;
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center px-5 py-16">
      <p className="font-display text-[11px] tracking-[0.2em] text-mist uppercase">
        Gate {round.id} · for {NAMES.nickname}
      </p>
      <h1 className="mt-3 font-display text-3xl tracking-wide text-parchment">
        {round.title}
      </h1>
      <p className="mt-2 font-letter text-lg text-brick-warm">{round.subtitle}</p>

      <article className="parchment-card mt-8 rounded-sm px-5 py-6">
        <p className="font-display text-[11px] tracking-[0.16em] text-brick-deep uppercase">
          This chapter is still being written
        </p>
        <p className="mt-3 font-letter text-lg leading-8">
          The world of this gate will look like no other. When it is time,
          the words, pictures, and music for{" "}
          <span className="italic">{round.placeholder}</span> will live here.
        </p>
      </article>

      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          className="brick-btn rounded-full px-6 py-3 font-display text-[11px] tracking-[0.16em] uppercase"
          onClick={() => {
            complete(n);
            router.push("/");
          }}
        >
          Close this chapter
        </button>
        <button
          type="button"
          className="rounded-full px-6 py-3 font-display text-[11px] tracking-[0.16em] text-mist uppercase"
          onClick={() => router.push("/")}
        >
          Return to the road
        </button>
      </div>
    </main>
  );
}
