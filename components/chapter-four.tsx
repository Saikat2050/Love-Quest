"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { HiddenNote } from "@/components/hidden-note";
import { StoryPhoto } from "@/components/story-photo";
import { useProgress } from "@/components/progress-provider";
import { CHAPTER_FOUR, type SpecialReason } from "@/content/game";
import {
  EMPTY_SPECIAL,
  readSpecialProgress,
  subscribeSpecial,
  writeSpecialProgress,
  type SpecialProgress,
} from "@/lib/special";

const REASONS = CHAPTER_FOUR.reasons;

export function ChapterFour() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { ready, isUnlocked, isCompleted, complete } = useProgress();
  const progress = useSyncExternalStore(subscribeSpecial, readSpecialProgress, () => EMPTY_SPECIAL);
  const { unlocked, screen, viewing } = progress;
  const reason = REASONS[viewing];
  const save = (next: SpecialProgress) => writeSpecialProgress(next);

  useEffect(() => {
    if (ready && !isUnlocked(4)) {
      router.replace("/");
    }
  }, [isUnlocked, ready, router]);

  useEffect(() => {
    if (screen !== "unlocking" || !reason) {
      return;
    }

    const wait = reduceMotion ? 0 : CHAPTER_FOUR.unlockMs;
    const timer = window.setTimeout(() => {
      writeSpecialProgress({
        unlocked: Math.max(unlocked, viewing + 1),
        screen: "reveal",
        viewing,
      });
    }, wait);

    return () => window.clearTimeout(timer);
  }, [reason, reduceMotion, screen, unlocked, viewing]);

  const openKey = (index: number) => {
    if (index > unlocked) {
      return;
    }

    if (index < unlocked || reduceMotion) {
      save({
        unlocked: Math.max(unlocked, index + 1),
        screen: "reveal",
        viewing: index,
      });
      return;
    }

    save({ unlocked, screen: "unlocking", viewing: index });
  };

  const afterReveal = () => {
    if (viewing >= REASONS.length - 1) {
      if (ready && !isCompleted(4)) {
        complete(4);
      }
      save({ unlocked: 3, screen: "album", viewing });
      return;
    }

    save({ unlocked, screen: "keys", viewing });
  };

  if (!ready || !isUnlocked(4)) {
    return <div className="special-page" />;
  }

  return (
    <main className="special-page">
      <span aria-hidden className="special-glow" />
      <span aria-hidden className="special-bloom special-bloom-a" />
      <span aria-hidden className="special-bloom special-bloom-b" />
      <span aria-hidden className="special-petal special-petal-a" />
      <span aria-hidden className="special-petal special-petal-b" />
      <span aria-hidden className="special-petal special-petal-c" />
      <HiddenNote id={CHAPTER_FOUR.hiddenNoteId} className="special-secret">
        <span aria-hidden>✦</span>
      </HiddenNote>

      {screen === "welcome" ? (
        <Welcome onStart={() => save({ unlocked, screen: "keys", viewing: 0 })} />
      ) : null}

      {screen === "keys" ? (
        <KeysScreen
          unlocked={unlocked}
          onBack={() => save({ unlocked, screen: "welcome", viewing })}
          onPick={openKey}
          onAlbum={() => {
            if (ready && !isCompleted(4)) {
              complete(4);
            }
            save({ unlocked: 3, screen: "album", viewing: 2 });
          }}
        />
      ) : null}

      {screen === "unlocking" && reason ? <Unlocking reason={reason} /> : null}

      {screen === "reveal" && reason ? (
        <RevealCard
          reason={reason}
          index={viewing}
          last={viewing >= REASONS.length - 1}
          onBack={() => save({ unlocked, screen: "keys", viewing })}
          onNext={afterReveal}
        />
      ) : null}

      {screen === "album" ? (
        <AlbumCard
          onRoad={() => {
            if (ready && !isCompleted(4)) {
              complete(4);
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
    <section className="special-card special-welcome">
      <p className="special-kicker">{CHAPTER_FOUR.levelLabel}</p>
      <h1>{CHAPTER_FOUR.title}</h1>
      <p className="special-tag">{CHAPTER_FOUR.subtitle}</p>
      <div className="special-ledge" aria-hidden>
        <span className="special-lantern special-lantern-left" />
        <div className="special-couple">
          <span className="is-him" />
          <span className="is-her" />
        </div>
        <span className="special-lantern special-lantern-right" />
      </div>
      <p className="special-intro">{CHAPTER_FOUR.welcome}</p>
      <button type="button" className="special-cta" onClick={onStart}>
        {CHAPTER_FOUR.start} ♥
      </button>
    </section>
  );
}

function KeysScreen({
  unlocked,
  onBack,
  onPick,
  onAlbum,
}: {
  unlocked: number;
  onBack: () => void;
  onPick: (index: number) => void;
  onAlbum: () => void;
}) {
  const lead =
    unlocked === 0
      ? CHAPTER_FOUR.keysLead
      : unlocked === REASONS.length - 1
        ? CHAPTER_FOUR.lastKey
        : unlocked >= REASONS.length
          ? CHAPTER_FOUR.albumTitle
          : CHAPTER_FOUR.moreKeys;

  return (
    <section className="special-card special-keys">
      <header className="special-bar">
        <button type="button" className="special-back" onClick={onBack} aria-label="Go back">
          ‹
        </button>
        <p>{CHAPTER_FOUR.title}</p>
      </header>
      <ol className="special-steps" aria-label="Reason progress">
        {REASONS.map((item, index) => (
          <li
            key={item.id}
            className={index < unlocked ? "is-done" : index === unlocked ? "is-now" : ""}
          >
            {index + 1}
          </li>
        ))}
      </ol>
      <p className="special-lead">{lead}</p>
      <div className="special-key-row">
        {REASONS.map((item, index) => {
          const locked = index > unlocked;
          const done = index < unlocked;
          const next = index === unlocked;
          const label = locked
            ? `Locked: ${item.title}`
            : done
              ? `Revisit ${item.title}`
              : `Unlock ${item.title}`;

          return (
            <button
              key={item.id}
              type="button"
              className={`special-key-slot${done ? " is-done" : ""}${next ? " is-next" : ""}${locked ? " is-locked" : ""}`}
              disabled={locked}
              aria-label={label}
              onClick={() => onPick(index)}
            >
              <span className="special-key-figure" aria-hidden>
                <MagicKey kind={item.key} />
              </span>
              <span className="special-pedestal">{index + 1}</span>
            </button>
          );
        })}
      </div>
      <p className="special-count" aria-live="polite">
        {unlocked} of {REASONS.length} reasons unlocked
      </p>
      {unlocked >= REASONS.length ? (
        <button type="button" className="special-cta" onClick={onAlbum}>
          {CHAPTER_FOUR.seeAll} →
        </button>
      ) : null}
    </section>
  );
}

function Unlocking({ reason }: { reason: SpecialReason }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="special-card special-unlock" aria-live="polite">
      <p className="special-kicker">{CHAPTER_FOUR.unlocking}</p>
      <h2>{CHAPTER_FOUR.unlockingLine}</h2>
      <div className="special-chest-stage">
        <motion.div
          className="special-fly-key"
          initial={reduceMotion ? false : { y: 88, scale: 1.15, opacity: 0.2 }}
          animate={{ y: 8, scale: 0.82, opacity: 1 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <MagicKey kind={reason.key} glowing />
        </motion.div>
        <div className="special-chest">
          <motion.span
            className="special-chest-lid"
            initial={false}
            animate={reduceMotion ? { rotateX: -52 } : { rotateX: [-2, -2, -56] }}
            transition={{ duration: 1.15, times: [0, 0.45, 1], ease: "easeInOut" }}
          />
          <span className="special-chest-body">
            <span className="special-lock" />
          </span>
        </div>
      </div>
    </section>
  );
}

function RevealCard({
  reason,
  index,
  last,
  onBack,
  onNext,
}: {
  reason: SpecialReason;
  index: number;
  last: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <section className="special-card special-reveal">
      <header className="special-bar">
        <button type="button" className="special-back" onClick={onBack} aria-label="Go back">
          ‹
        </button>
        <p>
          Reason {index + 1} of {REASONS.length}
        </p>
      </header>
      <p className="special-kicker">{reason.title}</p>
      <h2>{reason.headline}</h2>
      {reason.photo ? <StoryPhoto src={reason.photo} className="special-polaroid" /> : null}
      <p className="special-message">
        {reason.message} ♥
      </p>
      <button type="button" className="special-cta" onClick={onNext}>
        {last ? `${CHAPTER_FOUR.seeAll} →` : `${CHAPTER_FOUR.nextReason} →`}
      </button>
    </section>
  );
}

function AlbumCard({ onRoad }: { onRoad: () => void }) {
  return (
    <section className="special-card special-album">
      <p className="special-kicker">{CHAPTER_FOUR.title}</p>
      <h1>{CHAPTER_FOUR.albumTitle}</h1>
      <div className="special-scrap">
        {REASONS.map((reason, index) => (
          <article key={reason.id} className="special-scrap-card">
            <p>
              {index + 1}. {reason.title}
            </p>
            <h3>{reason.headline}</h3>
            {reason.photo ? (
              <StoryPhoto src={reason.photo} className="special-polaroid" compact />
            ) : null}
            <p>{reason.message}</p>
          </article>
        ))}
      </div>
      <p className="special-finale">{CHAPTER_FOUR.finale} ♥</p>
      <button type="button" className="special-cta" onClick={onRoad}>
        {CHAPTER_FOUR.continue} →
      </button>
    </section>
  );
}

function MagicKey({
  kind,
  glowing = false,
}: {
  kind: SpecialReason["key"];
  glowing?: boolean;
}) {
  const metal =
    kind === "heart" ? "#e8b15a" : kind === "star" ? "#b7c7e4" : "#e7b08c";
  const jewel =
    kind === "heart" ? "#f07a9a" : kind === "star" ? "#7f9ad0" : "#d97890";

  return (
    <svg
      className={`special-key-svg${glowing ? " is-glowing" : ""}`}
      viewBox="0 0 80 176"
      aria-hidden
    >
      {kind === "heart" ? (
        <path
          d="M40 18c10-16 34-2 24 18-7 14-24 30-24 30S23 50 16 36C6 16 30 2 40 18z"
          fill={jewel}
        />
      ) : null}
      {kind === "star" ? (
        <path
          d="M40 12l8 18 20 2-15 14 5 19-18-10-18 10 5-19L12 32l20-2z"
          fill={metal}
        />
      ) : null}
      {kind === "moon" ? (
        <path
          d="M50 16c-18 3-28 20-24 36 3 12 16 20 28 16-10 10-30 8-40-8C2 42 8 18 26 10c8-4 16-3 24 6z"
          fill={jewel}
        />
      ) : null}
      <circle cx="40" cy="58" r="11" fill="none" stroke={metal} strokeWidth="7" />
      <rect x="36" y="68" width="8" height="78" rx="3" fill={metal} />
      <rect x="44" y="124" width="18" height="8" rx="2" fill={metal} />
      <rect x="44" y="138" width="13" height="8" rx="2" fill={metal} />
      <circle cx="40" cy="42" r="4.5" fill="#fff8ee" opacity="0.9" />
    </svg>
  );
}
