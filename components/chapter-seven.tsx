"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useProgress } from "@/components/progress-provider";
import { CHAPTER_SEVEN } from "@/content/game";
import { writeDuck } from "@/lib/audio";
import { resetIntro } from "@/lib/intro";
import {
  EMPTY_FINALE,
  readFinaleProgress,
  subscribeFinale,
  writeFinaleProgress,
  type FinaleProgress,
} from "@/lib/finale";
import { EMPTY_FUTURE, writeFutureProgress } from "@/lib/future";
import { EMPTY_HEART, writeHeartProgress } from "@/lib/heart";
import { EMPTY_SPECIAL, writeSpecialProgress } from "@/lib/special";

export function ChapterSeven({ asEnding = false }: { asEnding?: boolean }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { ready, isUnlocked, isCompleted, complete, finish, reset, progress } = useProgress();
  const stored = useSyncExternalStore(subscribeFinale, readFinaleProgress, () => EMPTY_FINALE);
  const screen =
    asEnding && progress.finished && stored.screen === "welcome" ? "finale" : stored.screen;
  const save = (next: FinaleProgress) => writeFinaleProgress(next);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (asEnding) {
      if (!progress.finished && !isCompleted(7) && !isUnlocked(7)) {
        router.replace("/");
      }
      return;
    }

    if (!isUnlocked(7)) {
      router.replace("/");
    }
  }, [asEnding, isCompleted, isUnlocked, progress.finished, ready, router]);

  useEffect(() => {
    if (screen !== "opening") {
      return;
    }

    const wait = reduceMotion ? 0 : CHAPTER_SEVEN.openMs;
    const timer = window.setTimeout(() => {
      writeFinaleProgress({ screen: "letter" });
    }, wait);

    return () => window.clearTimeout(timer);
  }, [reduceMotion, screen]);

  useEffect(() => {
    if (!ready || screen !== "finale") {
      return;
    }

    if (!isCompleted(7)) {
      complete(7);
    }

    if (!progress.finished) {
      finish();
    }
  }, [complete, finish, isCompleted, progress.finished, ready, screen]);

  useEffect(() => {
    if (screen === "finale") {
      writeDuck(0.55);
      return () => writeDuck(1);
    }

    writeDuck(1);
    return () => writeDuck(1);
  }, [screen]);

  const locked = asEnding
    ? !ready || (!progress.finished && !isCompleted(7) && !isUnlocked(7))
    : !ready || !isUnlocked(7);

  if (locked) {
    return <div className="unlock-page" />;
  }

  if (screen === "finale") {
    return (
      <FinaleCard
        onReplay={() => {
          writeFinaleProgress(EMPTY_FINALE);
          writeFutureProgress(EMPTY_FUTURE);
          writeHeartProgress(EMPTY_HEART);
          writeSpecialProgress(EMPTY_SPECIAL);
          writeDuck(1);
          reset();
          resetIntro();
          router.replace("/");
        }}
        onReread={() => save({ screen: "letter" })}
      />
    );
  }

  return (
    <main className="unlock-page">
      <span aria-hidden className="unlock-glow" />
      <span aria-hidden className="unlock-bloom unlock-bloom-a" />
      <span aria-hidden className="unlock-bloom unlock-bloom-b" />
      <FloatingHearts />

      {screen === "welcome" || screen === "opening" ? (
        <Welcome
          opening={screen === "opening"}
          onOpen={() =>
            save({
              screen: reduceMotion ? "letter" : "opening",
            })
          }
        />
      ) : null}

      {screen === "letter" ? (
        <LetterCard
          onClose={() => save({ screen: "finale" })}
          onBack={() => save({ screen: "welcome" })}
        />
      ) : null}
    </main>
  );
}

function Welcome({
  opening,
  onOpen,
}: {
  opening: boolean;
  onOpen: () => void;
}) {
  return (
    <section className="unlock-card unlock-welcome">
      <p className="unlock-kicker">{CHAPTER_SEVEN.levelLabel}</p>
      <h1>{CHAPTER_SEVEN.title}</h1>
      <Envelope opening={opening} />
      <p className="unlock-intro">{CHAPTER_SEVEN.welcome}</p>
      {opening ? (
        <p className="unlock-opening-note">Your letter is opening…</p>
      ) : (
        <button type="button" className="unlock-cta" onClick={onOpen}>
          {CHAPTER_SEVEN.open} ♥
        </button>
      )}
    </section>
  );
}

function Envelope({ opening }: { opening: boolean }) {
  return (
    <div className={`unlock-envelope${opening ? " is-open" : ""}`} aria-hidden>
      <span className="unlock-envelope-sheet" />
      <span className="unlock-envelope-pocket" />
      <span className="unlock-envelope-flap" />
      <span className="unlock-envelope-seal">♥</span>
    </div>
  );
}

function LetterCard({
  onClose,
  onBack,
}: {
  onClose: () => void;
  onBack: () => void;
}) {
  return (
    <section className="unlock-letter-wrap">
      <div className="unlock-memories" aria-hidden>
        {CHAPTER_SEVEN.memories.map((src, index) => (
          <MemoryPhoto key={src} src={src} index={index} />
        ))}
      </div>

      <article className="unlock-letter">
        <header className="unlock-letter-head">
          <button type="button" className="unlock-back" onClick={onBack} aria-label="Go back">
            ‹
          </button>
          <p>{CHAPTER_SEVEN.kicker}</p>
        </header>
        <h2>{CHAPTER_SEVEN.greeting}</h2>
        {CHAPTER_SEVEN.paragraphs.map((paragraph, index) => (
          <p
            key={paragraph}
            className={index === CHAPTER_SEVEN.paragraphs.length - 1 ? "unlock-letter-wish" : undefined}
            style={{ animationDelay: `${0.12 + index * 0.08}s` }}
          >
            {paragraph}
            {index === CHAPTER_SEVEN.paragraphs.length - 1 ? " ♥" : null}
          </p>
        ))}
        <p className="unlock-sign">
          {CHAPTER_SEVEN.signoff}
          <br />
          {CHAPTER_SEVEN.from} ♥
        </p>
        <VoiceNote />
        <button type="button" className="unlock-cta" onClick={onClose}>
          {CHAPTER_SEVEN.close} ♥
        </button>
      </article>
    </section>
  );
}

const END_LANTERNS = [
  { left: "8%", delay: "0s", duration: "18s", size: "0.62rem" },
  { left: "24%", delay: "-5s", duration: "16s", size: "0.5rem" },
  { left: "71%", delay: "-9s", duration: "20s", size: "0.72rem" },
  { left: "86%", delay: "-3s", duration: "15s", size: "0.48rem" },
] as const;

function FinaleCard({
  onReplay,
  onReread,
}: {
  onReplay: () => void;
  onReread: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="ending-screen">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ending-photo" src={CHAPTER_SEVEN.photo} alt={CHAPTER_SEVEN.photoAlt} />
      <div aria-hidden className="ending-veil" />
      <div aria-hidden className="ending-stars" />
      <span aria-hidden className="ending-heart-glow" />
      <div aria-hidden className="ending-lanterns">
        {END_LANTERNS.map((lantern) => (
          <span
            key={lantern.left}
            className="opening-lantern"
            style={{
              left: lantern.left,
              animationDelay: lantern.delay,
              animationDuration: lantern.duration,
              width: lantern.size,
              height: `calc(${lantern.size} * 1.25)`,
            }}
          />
        ))}
      </div>
      <div aria-hidden className="opening-petals">
        {Array.from({ length: 8 }, (_, index) => (
          <span key={index} className={`opening-petal is-p${index + 1}`} />
        ))}
      </div>

      <div className="ending-copy">
        <motion.div
          className="ending-hero"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.12 }}
        >
          <h1 className="ending-title">
            {CHAPTER_SEVEN.finaleTitle} <span aria-hidden>♡</span>
          </h1>
          <p className="ending-sub">{CHAPTER_SEVEN.finaleSub}</p>
          <p className="ending-note">{CHAPTER_SEVEN.finaleNote}</p>
        </motion.div>

        <motion.div
          className="ending-actions"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <div className="ending-choice">
            <button type="button" className="ending-replay" onClick={onReplay}>
              {CHAPTER_SEVEN.replay} ♥
            </button>
            <p>{CHAPTER_SEVEN.replayNote}</p>
          </div>
          <div className="ending-choice">
            <button type="button" className="ending-reread" onClick={onReread}>
              {CHAPTER_SEVEN.reread} ♡
            </button>
            <p>{CHAPTER_SEVEN.rereadNote}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function VoiceNote() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => writeDuck(1);
  }, []);

  if (!CHAPTER_SEVEN.voiceSrc) {
    return null;
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={CHAPTER_SEVEN.voiceSrc}
        preload="metadata"
        onCanPlay={() => setReady(true)}
        onError={() => {
          setReady(false);
          setPlaying(false);
          writeDuck(1);
        }}
        onEnded={() => {
          setPlaying(false);
          writeDuck(1);
        }}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
      {ready ? (
        <button
          type="button"
          className="unlock-voice"
          aria-pressed={playing}
          onClick={() => {
            const node = audioRef.current;
            if (!node) {
              return;
            }

            if (node.paused) {
              writeDuck(0.18);
              node.play().catch(() => {
                writeDuck(1);
              });
              return;
            }

            node.pause();
            writeDuck(1);
          }}
        >
          {playing ? CHAPTER_SEVEN.voicePause : CHAPTER_SEVEN.voice} ♪
        </button>
      ) : null}
    </>
  );
}

function MemoryPhoto({ src, index }: { src: string; index: number }) {
  const [ready, setReady] = useState(false);

  return (
    <figure className={`unlock-polaroid is-m${index + 1}${ready ? " is-ready" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" onLoad={() => setReady(true)} onError={() => setReady(false)} />
    </figure>
  );
}

function FloatingHearts({ night = false }: { night?: boolean }) {
  return (
    <div className={`unlock-hearts${night ? " is-night" : ""}`} aria-hidden>
      {Array.from({ length: 10 }, (_, index) => (
        <span key={index} className={`unlock-heart is-h${index + 1}`}>
          ♥
        </span>
      ))}
    </div>
  );
}
