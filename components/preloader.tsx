"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GAME, NAMES, OPENING } from "@/content/game";

const LANTERNS = [
  { left: "12%", delay: "0s", duration: "16s", size: "0.7rem" },
  { left: "28%", delay: "-4s", duration: "18s", size: "0.55rem" },
  { left: "63%", delay: "-8s", duration: "15s", size: "0.8rem" },
  { left: "78%", delay: "-2s", duration: "20s", size: "0.5rem" },
  { left: "88%", delay: "-11s", duration: "17s", size: "0.65rem" },
] as const;

export function Preloader({ onDone }: { onDone: () => void }) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  const finish = useCallback(() => {
    onDone();
  }, [onDone]);

  useEffect(() => {
    const wait = reduceMotion ? 0 : 900;
    const timer = window.setTimeout(() => setReady(true), wait);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <div className="opening-screen">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="opening-photo" src={OPENING.image} alt={OPENING.imageAlt} />
      <div aria-hidden className="opening-veil" />
      <div aria-hidden className="opening-stars" />
      <div aria-hidden className="opening-lanterns">
        {LANTERNS.map((lantern) => (
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

      <div className="opening-copy">
        <motion.div
          className="opening-hero"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          <p className="opening-kicker">
            <span aria-hidden>♡</span> {OPENING.kicker} <span aria-hidden>♡</span>
          </p>
          <h1 className="opening-title">
            {GAME.title} <span aria-hidden>♡</span>
          </h1>
          <p className="opening-lead">{OPENING.lead}</p>
          <p className="opening-for">
            <span aria-hidden>♡</span> {OPENING.forYou}, {NAMES.nickname} <span aria-hidden>♡</span>
          </p>
        </motion.div>

        <motion.div
          className="opening-actions"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 12 }}
          transition={{ duration: 0.7 }}
        >
          <button type="button" className="opening-begin" onClick={finish} disabled={!ready}>
            {OPENING.begin} →
          </button>
          <p className="opening-foot">{OPENING.foot}</p>
        </motion.div>
      </div>
    </div>
  );
}
