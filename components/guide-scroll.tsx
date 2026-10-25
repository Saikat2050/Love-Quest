"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { GUIDE } from "@/content/game";

export function GuideScroll({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("guide-open");
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      document.body.classList.remove("guide-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, open]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="guide-overlay">
      <button type="button" className="guide-backdrop" aria-label="Close the guide" onClick={onClose} />
      <article className="guide-scroll" role="dialog" aria-modal="true" aria-labelledby="guide-title">
        <span aria-hidden className="guide-roll is-top" />
        <div className="guide-sheet">
          <header className="guide-head">
            <p>{GUIDE.kicker}</p>
            <h2 id="guide-title">{GUIDE.title}</h2>
            <button type="button" className="guide-x" onClick={onClose} aria-label="Close the guide">
              ×
            </button>
          </header>
          <p className="guide-lead">{GUIDE.lead}</p>
          <ol className="guide-chapters">
            {GUIDE.chapters.map((chapter) => (
              <li key={chapter.id}>
                <p>
                  Gate {chapter.id}
                </p>
                <h3>{chapter.title}</h3>
                <p>{chapter.how}</p>
              </li>
            ))}
          </ol>
          <div className="guide-hidden">
            <p>✦ 7 of 7</p>
            <h3>{GUIDE.notesTitle}</h3>
            <p>{GUIDE.notes}</p>
          </div>
          <p className="guide-note">{GUIDE.music}</p>
          <button type="button" className="guide-close" onClick={onClose}>
            {GUIDE.close}
          </button>
        </div>
        <span aria-hidden className="guide-roll is-bottom" />
      </article>
    </div>,
    document.body,
  );
}
