"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GuideScroll } from "@/components/guide-scroll";
import { HiddenCounter } from "@/components/hidden-counter";
import { useProgress } from "@/components/progress-provider";
import { GAME, GUIDE, NAMES, ROUNDS, type RoundId } from "@/content/game";

export function BrickRoadMap() {
  const router = useRouter();
  const { ready, progress, isUnlocked, isCompleted, cityUnlocked } = useProgress();
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    if (ready && progress.finished) {
      router.replace("/ending");
    }
  }, [progress.finished, ready, router]);

  if (!ready || progress.finished) {
    return <div className="min-h-dvh" />;
  }

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pb-[max(7rem,calc(env(safe-area-inset-bottom)+5.5rem))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <HiddenCounter tone="map" />
      <header className="relative z-10 pb-8 text-center">
        <p className="font-display text-[11px] tracking-[0.22em] text-mist uppercase">
          A road of yellow brick
        </p>
        <h1 className="mt-2 font-display text-[2rem] leading-tight text-parchment">
          {GAME.title}
        </h1>
        <p className="mt-1 font-script text-4xl text-brick-warm">
          for {NAMES.her}
        </p>
        <p className="mx-auto mt-4 max-w-xs font-letter text-lg leading-7 text-mist">
          {GAME.tagline}
        </p>
        <button
          type="button"
          className="map-guide-open mt-5 flex w-full items-center gap-3 rounded-2xl border border-brick-gold/60 bg-sky/55 px-4 py-3 text-left text-parchment"
          onClick={() => setGuideOpen(true)}
        >
          <span aria-hidden className="map-guide-icon" />
          <span className="grid gap-0.5">
            <span className="font-display text-[0.95rem]">{GUIDE.open}</span>
            <span className="font-letter text-sm text-mist">{GUIDE.openHint}</span>
          </span>
        </button>
      </header>

      <GuideScroll open={guideOpen} onClose={() => setGuideOpen(false)} />

      <ol className="relative">
        <span
          aria-hidden
          className="absolute top-3 bottom-3 left-[15px] w-[10px] rounded-full bg-brick-gold shadow-[0_0_18px_rgba(212,168,75,0.35)]"
        />
        <span
          aria-hidden
          className="absolute top-3 bottom-3 left-[18px] w-[4px] rounded-full bg-[repeating-linear-gradient(180deg,#8a6a28_0_7px,#d4a84b_7px_14px)] opacity-80"
        />

        {ROUNDS.map((round) => (
          <li key={round.id} className="relative flex items-start gap-4 py-3">
            <RoadNode
              id={round.id}
              unlocked={isUnlocked(round.id)}
              completed={isCompleted(round.id)}
            />
            <div className="min-w-0 flex-1 pt-0.5">
              <Gate
                id={round.id}
                title={round.title}
                subtitle={round.subtitle}
                unlocked={isUnlocked(round.id)}
                completed={isCompleted(round.id)}
              />
            </div>
          </li>
        ))}

        <li className="relative flex items-start gap-4 pt-3">
          <RoadNode unlocked={cityUnlocked} completed={cityUnlocked} city />
          <div className="min-w-0 flex-1">
            <EmeraldCity unlocked={cityUnlocked} />
          </div>
        </li>
      </ol>
    </main>
  );
}

function RoadNode({
  id,
  unlocked,
  completed,
  city = false,
}: {
  id?: RoundId;
  unlocked: boolean;
  completed: boolean;
  city?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={`relative z-10 mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-xs ${
        completed
          ? "bg-emerald-soft text-sky-deep"
          : unlocked
            ? "gate-pulse bg-brick-gold text-sky-deep"
            : "bg-[#2a2438] text-mist ring-1 ring-white/15"
      }`}
    >
      {city ? "◆" : completed ? "✦" : id}
    </span>
  );
}

function Gate({
  id,
  title,
  subtitle,
  unlocked,
  completed,
}: {
  id: RoundId;
  title: string;
  subtitle: string;
  unlocked: boolean;
  completed: boolean;
}) {
  const state = completed ? "opened" : unlocked ? "waiting" : "asleep";
  const inner = (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.06 * id, duration: 0.45 }}
      className={`rounded-2xl border px-4 py-3 ${
        completed
          ? "border-emerald-soft/45 bg-emerald-dusk/45"
          : unlocked
            ? "border-brick-gold/65 bg-sky/55"
            : "border-white/10 bg-sky/30 opacity-75"
      }`}
    >
      <span className="block font-display text-[10px] tracking-[0.18em] text-mist uppercase">
        Gate {id} · {state}
      </span>
      <span className="mt-1 block font-display text-[15px] leading-snug text-parchment">
        {title}
      </span>
      <span className="mt-0.5 block font-letter text-sm leading-6 text-mist/85">
        {unlocked ? subtitle : "The mist still holds this door."}
      </span>
    </motion.div>
  );

  if (!unlocked) {
    return (
      <div aria-disabled className="cursor-not-allowed">
        {inner}
      </div>
    );
  }

  return <Link href={`/round/${id}`}>{inner}</Link>;
}

function EmeraldCity({ unlocked }: { unlocked: boolean }) {
  const city = (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.55, duration: 0.5 }}
      className={`rounded-2xl border px-4 py-4 ${
        unlocked
          ? "city-glow border-emerald-soft/50 bg-emerald-dusk/35"
          : "border-white/10 bg-sky/25 opacity-80"
      }`}
    >
      <svg viewBox="0 0 220 92" className="h-14 w-36" aria-hidden>
        <path
          d="M8 88 L28 88 L28 58 L42 44 L42 88 L62 88 L62 36 L78 18 L86 36 L86 88 L108 88 L108 28 L124 8 L140 28 L140 88 L158 88 L158 42 L174 26 L174 88 L196 88 L196 54 L212 54 L212 88 L8 88"
          fill={unlocked ? "#6fa888" : "#2a3d38"}
          stroke={unlocked ? "#8fd4b0" : "#4a5e58"}
          strokeWidth="1.4"
        />
        <circle cx="124" cy="22" r="4" fill={unlocked ? "#e8c872" : "#6a6a4a"} />
      </svg>
      <p className="mt-2 font-display text-[11px] tracking-[0.18em] text-emerald-glow uppercase">
        The Emerald City
      </p>
      <p className="mt-1 font-letter text-sm leading-6 text-parchment/85">
        {unlocked
          ? "The last door is open. The scroll is waiting."
          : "It will appear when the seventh gate falls."}
      </p>
    </motion.div>
  );

  if (!unlocked) {
    return city;
  }

  return <Link href="/ending">{city}</Link>;
}
