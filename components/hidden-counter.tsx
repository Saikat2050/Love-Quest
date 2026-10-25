"use client";

import { useState } from "react";
import { HIDDEN_NOTES } from "@/content/game";
import { useProgress } from "@/components/progress-provider";

export function HiddenCounter({
  className = "",
  tone = "letter",
}: {
  className?: string;
  tone?: "letter" | "map";
}) {
  const { progress, ready } = useProgress();
  const found = ready ? progress.unlockedHiddenNotes.length : 0;
  const total = HIDDEN_NOTES.length;

  if (tone === "map") {
    return <MapHiddenShortcut found={found} total={total} />;
  }

  return (
    <p className={`hidden-counter ${className}`}>
      Hidden message {found} / {total}
    </p>
  );
}

function MapHiddenShortcut({ found, total }: { found: number; total: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="map-secret">
      <button
        type="button"
        className="map-secret-chip"
        aria-expanded={open}
        aria-label={`Hidden messages ${found} of ${total}`}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden>✦</span>
        <span>
          {found} / {total}
        </span>
      </button>
      {open ? (
        <div className="map-secret-card">
          <p>Hidden messages</p>
          <p>
            {found} of {total} found
          </p>
          <p>Long-press quiet places. They stay found.</p>
        </div>
      ) : null}
    </div>
  );
}
