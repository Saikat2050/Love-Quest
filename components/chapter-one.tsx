"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HiddenCounter } from "@/components/hidden-counter";
import { HiddenNote } from "@/components/hidden-note";
import { useProgress } from "@/components/progress-provider";
import { CHAPTER_ONE } from "@/content/game";

export function ChapterOne() {
  const router = useRouter();
  const { ready, isUnlocked, complete } = useProgress();

  useEffect(() => {
    if (ready && !isUnlocked(1)) {
      router.replace("/");
    }
  }, [isUnlocked, ready, router]);

  if (!ready || !isUnlocked(1)) {
    return <div className="min-h-dvh bg-[#fff6f4]" />;
  }

  return (
    <main className="letter-page">
      <header className="letter-top">
        <HiddenCounter />
        <p className="letter-kicker">♡ {CHAPTER_ONE.kicker} ♡</p>
        <h1 className="letter-hello">
          {CHAPTER_ONE.greeting} <span aria-hidden>💝</span>
        </h1>
      </header>

      <figure className="letter-hero">
        <Image
          src={CHAPTER_ONE.image}
          alt="Two figures under a heart of stars"
          width={1600}
          height={900}
          priority
          className="letter-hero-image"
        />
        <HiddenNote id={CHAPTER_ONE.hiddenNoteId} className="letter-secret">
          <span className="letter-secret-star" aria-hidden>
            ✦
          </span>
        </HiddenNote>
      </figure>

      <article className="letter-body">
        {CHAPTER_ONE.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="letter-closing">
          {CHAPTER_ONE.closing} <span aria-hidden>❤️</span>
        </p>
        <p className="letter-cta">
          {CHAPTER_ONE.cta} <span aria-hidden>💕</span>
        </p>
      </article>

      <footer className="letter-foot">
        <button
          type="button"
          className="letter-begin"
          onClick={() => {
            complete(1);
            router.push("/");
          }}
        >
          Begin the adventure
        </button>
        <p className="letter-signoff">{CHAPTER_ONE.signoff}</p>
        <button type="button" className="letter-back" onClick={() => router.push("/")}>
          Return to the road
        </button>
      </footer>
    </main>
  );
}
