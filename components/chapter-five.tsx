"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HiddenNote } from "@/components/hidden-note";
import { useProgress } from "@/components/progress-provider";
import { CHAPTER_FIVE, REVEAL_HEART_PHOTO } from "@/content/game";
import {
  EMPTY_HEART,
  readHeartProgress,
  subscribeHeart,
  writeHeartProgress,
  type HeartProgress,
} from "@/lib/heart";

const HEART_COUNT = CHAPTER_FIVE.heartCount;

const HEART_SPOTS = [
  { x: 8, y: 16 },
  { x: 86, y: 14 },
  { x: 4, y: 40 },
  { x: 90, y: 38 },
  { x: 12, y: 64 },
  { x: 84, y: 62 },
  { x: 30, y: 8 },
  { x: 66, y: 10 },
  { x: 24, y: 82 },
  { x: 72, y: 80 },
] as const;

export function ChapterFive() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { ready, isUnlocked, isCompleted, complete } = useProgress();
  const progress = useSyncExternalStore(subscribeHeart, readHeartProgress, () => EMPTY_HEART);
  const { collected, screen } = progress;
  const save = (next: HeartProgress) => writeHeartProgress(next);

  useEffect(() => {
    if (ready && !isUnlocked(5)) {
      router.replace("/");
    }
  }, [isUnlocked, ready, router]);

  useEffect(() => {
    if (!ready || !isCompleted(5) || screen === "finale") {
      return;
    }

    writeHeartProgress({
      collected: Array.from({ length: HEART_COUNT }, (_, index) => index),
      screen: "finale",
    });
  }, [ready, isCompleted, screen]);

  useEffect(() => {
    if (screen !== "play" || collected.length < HEART_COUNT) {
      return;
    }

    const wait = reduceMotion ? 0 : CHAPTER_FIVE.finaleDelayMs;
    const timer = window.setTimeout(() => {
      writeHeartProgress({ collected, screen: "finale" });
    }, wait);

    return () => window.clearTimeout(timer);
  }, [collected, reduceMotion, screen]);

  const collect = (id: number) => {
    const latest = readHeartProgress();
    if (latest.collected.includes(id) || latest.collected.length >= HEART_COUNT) {
      return;
    }

    save({
      collected: [...latest.collected, id],
      screen: "play",
    });
  };

  if (!ready || !isUnlocked(5)) {
    return <div className="heart-page" />;
  }

  return (
    <main className="heart-page">
      <span aria-hidden className="heart-glow" />
      <span aria-hidden className="heart-bloom heart-bloom-a" />
      <span aria-hidden className="heart-bloom heart-bloom-b" />
      <HiddenNote id={CHAPTER_FIVE.hiddenNoteId} className="heart-secret">
        <span aria-hidden>✦</span>
      </HiddenNote>

      {screen === "welcome" ? (
        <Welcome
          onStart={() =>
            save({
              collected: isCompleted(5)
                ? Array.from({ length: HEART_COUNT }, (_, index) => index)
                : collected,
              screen: isCompleted(5) || collected.length >= HEART_COUNT ? "finale" : "play",
            })
          }
        />
      ) : null}

      {screen === "play" ? (
        <PlayScreen collected={collected} reduceMotion={Boolean(reduceMotion)} onCollect={collect} />
      ) : null}

      {screen === "finale" ? (
        <FinaleCard
          onKeep={() => {
            if (ready && !isCompleted(5)) {
              complete(5);
            }
            router.push("/");
          }}
        />
      ) : null}
    </main>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <section className="heart-card heart-welcome">
      <p className="heart-kicker">{CHAPTER_FIVE.levelLabel}</p>
      <h1>
        {CHAPTER_FIVE.title} <span aria-hidden>♥</span>
      </h1>
      <p className="heart-tag">{CHAPTER_FIVE.subtitle}</p>
      <div className="heart-welcome-orb" aria-hidden>
        <span />
      </div>
      <p className="heart-intro">{CHAPTER_FIVE.welcome} ♥</p>
      <button type="button" className="heart-cta" onClick={onStart}>
        {CHAPTER_FIVE.start} ♥
      </button>
    </section>
  );
}

function PlayScreen({
  collected,
  reduceMotion,
  onCollect,
}: {
  collected: number[];
  reduceMotion: boolean;
  onCollect: (id: number) => void;
}) {
  const count = collected.length;
  const milestone = [...CHAPTER_FIVE.milestones].reverse().find((item) => count >= item.at);
  const celebrating = count >= HEART_COUNT;

  return (
    <section className="heart-play">
      <p className="heart-count" aria-live="polite">
        ♡ {count} / {HEART_COUNT} {CHAPTER_FIVE.progressLabel}
      </p>
      <div className="heart-meter" aria-hidden>
        {Array.from({ length: HEART_COUNT }, (_, index) => (
          <span key={index} className={index < count ? "is-on" : ""} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {milestone ? (
          <motion.p
            key={milestone.at}
            className="heart-bubble"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          >
            {milestone.text} ♥
          </motion.p>
        ) : (
          <p className="heart-bubble is-quiet">Collect the hearts around this memory.</p>
        )}
      </AnimatePresence>

      <div className="heart-stage">
        <HeartPortrait collected={count} framed={celebrating} />
        {celebrating ? <span aria-hidden className="heart-burst" /> : null}
        {HEART_SPOTS.map((spot, index) => (
          <CollectibleHeart
            key={index}
            id={index}
            x={spot.x}
            y={spot.y}
            taken={collected.includes(index)}
            locked={celebrating}
            reduceMotion={reduceMotion}
            onCollect={onCollect}
          />
        ))}
      </div>
    </section>
  );
}

function CollectibleHeart({
  id,
  x,
  y,
  taken,
  locked,
  reduceMotion,
  onCollect,
}: {
  id: number;
  x: number;
  y: number;
  taken: boolean;
  locked: boolean;
  reduceMotion: boolean;
  onCollect: (id: number) => void;
}) {
  return (
    <motion.button
      type="button"
      className={`heart-orb${taken ? " is-taken" : ""}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      disabled={taken || locked}
      aria-label={taken ? `Heart ${id + 1} collected` : `Collect heart ${id + 1} of ${HEART_COUNT}`}
      initial={false}
      animate={
        taken
          ? { left: "50%", top: "46%", scale: 0.15, opacity: 0 }
          : reduceMotion
            ? { opacity: 1, scale: 1 }
            : { y: [0, -7, 0], opacity: 1 }
      }
      transition={
        taken
          ? { duration: reduceMotion ? 0.01 : 0.55, ease: [0.22, 1, 0.36, 1] }
          : { duration: 3.2 + (id % 4) * 0.35, repeat: Infinity, ease: "easeInOut" }
      }
      onClick={() => onCollect(id)}
    >
      ♥
    </motion.button>
  );
}

function FinaleCard({ onKeep }: { onKeep: () => void }) {
  return (
    <section className="heart-card heart-finale">
      <p className="heart-kicker">{CHAPTER_FIVE.letterKicker}</p>
      <h1>{CHAPTER_FIVE.letterTitle}</h1>
      <HeartPortrait collected={HEART_COUNT} framed polaroid />
      <article className="heart-letter">
        {CHAPTER_FIVE.letter.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="heart-letter-end">♥</p>
      </article>
      <button type="button" className="heart-cta" onClick={onKeep}>
        {CHAPTER_FIVE.keep} ♥
      </button>
    </section>
  );
}

function HeartPortrait({
  collected,
  framed = false,
  polaroid = false,
}: {
  collected: number;
  framed?: boolean;
  polaroid?: boolean;
}) {
  const reveal = collected / HEART_COUNT;
  const src = useMemo(() => CHAPTER_FIVE.photo || REVEAL_HEART_PHOTO, []);

  return (
    <figure
      className={`heart-portrait${framed ? " is-framed" : ""}${polaroid ? " is-polaroid" : ""}`}
      style={{ "--reveal": String(reveal) } as React.CSSProperties}
    >
      <svg className="heart-clip" width="0" height="0" aria-hidden>
        <defs>
          <clipPath id="reveal-heart-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.93 C0.5,0.93 0.03,0.6 0.03,0.34 C0.03,0.18 0.16,0.07 0.31,0.11 C0.4,0.14 0.47,0.24 0.5,0.33 C0.53,0.24 0.6,0.14 0.69,0.11 C0.84,0.07 0.97,0.18 0.97,0.34 C0.97,0.6 0.5,0.93 0.5,0.93 Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="heart-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="A photograph of the two of you" />
        <span aria-hidden className="heart-mist" />
      </div>
    </figure>
  );
}
