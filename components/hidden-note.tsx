"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { getHiddenNote } from "@/content/game";
import { useProgress } from "@/components/progress-provider";

const HOLD_MS = 650;

type HiddenNoteProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

export function HiddenNote({ id, children, className }: HiddenNoteProps) {
  const { unlockNote } = useProgress();
  const note = getHiddenNote(id);
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);

  const start = () => {
    timer.current = window.setTimeout(() => {
      if (note) {
        unlockNote(id);
        setOpen(true);
        if (navigator.vibrate) {
          navigator.vibrate(18);
        }
      }
    }, HOLD_MS);
  };

  const cancel = () => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  if (!note) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        className={className}
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        onContextMenu={(event) => event.preventDefault()}
        role="button"
        tabIndex={0}
        aria-label="Something waits here"
      >
        {children}
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="scroll-veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.article
              className="love-scroll"
              initial={{ scaleY: 0.08, opacity: 0.4 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0.08, opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 0.8, 0.2, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <span className="love-scroll-rod" aria-hidden />
              <p className="love-scroll-kicker">{note.title}</p>
              <p className="love-scroll-body">{note.body}</p>
              <button type="button" className="love-scroll-close" onClick={() => setOpen(false)}>
                Roll it closed
              </button>
              <span className="love-scroll-rod is-bottom" aria-hidden />
            </motion.article>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
