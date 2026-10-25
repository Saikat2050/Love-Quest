"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { preload } from "react-dom";
import { AUDIO, BOOT, OPENING } from "@/content/game";
import { collectStoryAssets } from "@/lib/assets";
import { markBootReady, preloadStoryAssets } from "@/lib/boot";

const MIN_MS = 9000;
const EXIT_MS = 1100;
const STAGE_AT = [0, 2000, 4200, 6800] as const;

export function BootLoader() {
  preload(OPENING.image, { as: "image" });
  preload(AUDIO.music, { as: "audio" });

  const reduceMotion = useReducedMotion();
  const assets = useMemo(() => collectStoryAssets(), []);
  const memories = useMemo(
    () => BOOT.memories.filter((src) => assets.includes(src)),
    [assets],
  );
  const total = Math.max(assets.length, 1);
  const started = useRef(0);
  const [done, setDone] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [assetsReady, setAssetsReady] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [muted, setMuted] = useState(true);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  const realPercent = Math.round((done / total) * 100);
  const stage = pickStage(realPercent, elapsed, assetsReady, Boolean(reduceMotion));
  const copy = BOOT.stages[stage - 1];

  useEffect(() => {
    started.current = performance.now();
    let alive = true;
    preloadStoryAssets(assets, (next, count) => {
      if (alive) {
        setDone(next > count ? count : next);
      }
    })
      .then(() => document.fonts.ready.catch(() => undefined))
      .catch(() => undefined)
      .finally(() => {
        if (alive) {
          setAssetsReady(true);
        }
      });

    return () => {
      alive = false;
    };
  }, [assets]);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const tick = window.setInterval(() => {
      if (document.hidden) {
        return;
      }
      setElapsed(performance.now() - started.current);
    }, 160);

    return () => window.clearInterval(tick);
  }, [reduceMotion]);

  useEffect(() => {
    if (!assetsReady) {
      return;
    }

    const wait = reduceMotion
      ? 280
      : Math.max(EXIT_MS, MIN_MS - (performance.now() - started.current));
    const timer = window.setTimeout(markBootReady, wait);
    return () => window.clearTimeout(timer);
  }, [assetsReady, reduceMotion]);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    return () => {
      musicRef.current?.pause();
    };
  }, []);

  const toggleSong = () => {
    const node = musicRef.current ?? window.__loveQuestAudio?.get(AUDIO.music) ?? new Audio(AUDIO.music);
    musicRef.current = node;
    void toggleBootMusic(node, muted).then(setMuted);
  };

  return (
    <div
      className={`boot-screen is-s${stage}${hidden ? " is-hidden" : ""}${reduceMotion ? " is-still" : ""}`}
      role="status"
      aria-live="polite"
      aria-busy={!assetsReady}
      aria-label={`${copy.title}. ${copy.line} ${realPercent} percent`}
    >
      <div aria-hidden className="boot-sky" />
      <div aria-hidden className="boot-stars is-far" />
      <div aria-hidden className="boot-stars is-near" />
      <div aria-hidden className="boot-clouds">
        <span className="boot-cloud is-a" />
        <span className="boot-cloud is-b" />
        <span className="boot-cloud is-c" />
      </div>
      <div aria-hidden className="boot-dust" />
      <div aria-hidden className="boot-hearts">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className={`boot-heart-soft is-h${index + 1}`}>
            ♥
          </span>
        ))}
      </div>
      <div aria-hidden className="boot-petals">
        {Array.from({ length: 8 }, (_, index) => (
          <span key={index} className={`boot-petal is-p${index + 1}`} />
        ))}
      </div>

      <div className="boot-stage" aria-hidden>
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            className="boot-stage-inner"
            initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10, scale: 1.03 }}
            transition={{ duration: 0.75, ease: [0.22, 0.8, 0.2, 1] }}
          >
            {stage === 1 ? <BookStage /> : null}
            {stage === 2 ? <MemoryStage photos={memories} /> : null}
            {stage === 3 ? <HeartStage /> : null}
            {stage === 4 ? <PortalStage /> : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="boot-copy">
        <p className="boot-kicker">{copy.title}</p>
        <p className="boot-line">{copy.line}</p>
        <div className="boot-meter">
          <span className="boot-meter-fill" style={{ width: `${realPercent}%` }} />
          <span className="boot-meter-heart" style={{ left: `${realPercent}%` }}>
            ♥
          </span>
        </div>
        <p className="boot-count">
          {realPercent}% · {done} of {total}
        </p>
      </div>

      <button type="button" className="boot-audio" onClick={toggleSong}>
        {muted ? "Play the song" : "Mute the song"}
      </button>
    </div>
  );
}

function pickStage(real: number, elapsed: number, ready: boolean, still: boolean): 1 | 2 | 3 | 4 {
  if (still) {
    return stageFromPercent(real);
  }

  if (ready) {
    if (elapsed < STAGE_AT[1]) {
      return 1;
    }
    if (elapsed < STAGE_AT[2]) {
      return 2;
    }
    if (elapsed < STAGE_AT[3]) {
      return 3;
    }
    return 4;
  }

  return stageFromPercent(real);
}

function toggleBootMusic(node: HTMLAudioElement, currentlyMuted: boolean): Promise<boolean> {
  node.loop = true;
  node.preload = "auto";
  if (!currentlyMuted) {
    node.pause();
    return Promise.resolve(true);
  }
  node.volume = 0.28;
  return node.play().then(() => false).catch(() => true);
}

function stageFromPercent(real: number): 1 | 2 | 3 | 4 {
  if (real < 10) {
    return 1;
  }
  if (real < 40) {
    return 2;
  }
  if (real < 75) {
    return 3;
  }
  return 4;
}

function BookStage() {
  return (
    <div className="boot-book">
      <span className="boot-book-glow" />
      <div className="boot-book-body">
        <span className="boot-book-page" />
        <span className="boot-book-cover">
          <svg viewBox="0 0 120 160" className="boot-book-art">
            <defs>
              <radialGradient id="boot-gem" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fff8fb" />
                <stop offset="45%" stopColor="#f4a0c8" />
                <stop offset="100%" stopColor="#c24e72" />
              </radialGradient>
            </defs>
            <rect x="8" y="8" width="104" height="144" rx="10" fill="#4a2048" stroke="#d4a84b" strokeWidth="4" />
            <path d="M60 88c-16-14-28-26-20-40 6-10 16-6 20 4 4-10 14-14 20-4 8 14-4 26-20 40z" fill="url(#boot-gem)" />
            <circle cx="60" cy="66" r="18" fill="none" stroke="#e8c872" strokeWidth="1.4" opacity="0.85" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function MemoryStage({ photos }: { photos: readonly string[] }) {
  const tiles = Array.from({ length: 8 }, (_, index) => photos[index] ?? "");

  return (
    <div className="boot-memories">
      <span className="boot-memory-ring" />
      <div className="boot-frames">
        {tiles.map((src, index) => (
          <figure key={`${src}-${index}`} className={`boot-frame is-f${index + 1}`}>
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" />
            ) : (
              <span className="boot-frame-empty" />
            )}
          </figure>
        ))}
      </div>
      <svg viewBox="0 0 64 64" className="boot-memory-pair">
        <circle cx="24" cy="22" r="7" fill="#f4d0b8" />
        <circle cx="40" cy="22" r="7" fill="#f4c4c8" />
        <path d="M12 48c2-12 12-16 20-16s18 4 20 16" fill="#e8d4a8" />
      </svg>
    </div>
  );
}

function HeartStage() {
  return (
    <div className="boot-bloom">
      <span className="boot-bloom-ring" />
      <svg viewBox="0 0 120 110" className="boot-bloom-heart">
        <defs>
          <radialGradient id="boot-heart" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#fff6fb" />
            <stop offset="38%" stopColor="#f4a0c0" />
            <stop offset="100%" stopColor="#c24e72" />
          </radialGradient>
        </defs>
        <path
          d="M60 96C24 70 8 46 22 24c10-16 26-10 38 6 12-16 28-22 38-6 14 22-2 46-38 72z"
          fill="url(#boot-heart)"
        />
      </svg>
      {Array.from({ length: 10 }, (_, index) => (
        <span key={index} className={`boot-bloom-petal is-b${index + 1}`} />
      ))}
    </div>
  );
}

function PortalStage() {
  return (
    <div className="boot-portal">
      <span className="boot-portal-glow" />
      <svg viewBox="0 0 180 180" className="boot-portal-gate">
        <defs>
          <radialGradient id="boot-portal" cx="50%" cy="58%" r="52%">
            <stop offset="0%" stopColor="#fff6e0" />
            <stop offset="42%" stopColor="#f0b8d8" />
            <stop offset="100%" stopColor="#7a5ad0" stopOpacity="0.15" />
          </radialGradient>
        </defs>
        <path
          d="M90 164C28 112 16 64 42 28c16-22 34-10 48 16 14-26 32-38 48-16 26 36 14 84-48 136z"
          fill="url(#boot-portal)"
          stroke="#e8c872"
          strokeWidth="4"
        />
        <path d="M66 118h48v22H66z" fill="#f7e6c8" opacity="0.85" />
        <path d="M72 118V96l18-16 18 16v22" fill="#fff4dc" />
        <path d="M92 86l10-12 10 8v16H92z" fill="#fff8ea" />
      </svg>
    </div>
  );
}
