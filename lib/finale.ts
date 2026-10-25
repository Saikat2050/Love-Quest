const KEY = "love-quest-chapter-7";
export const FINALE_EVENT = "love-quest-chapter-7";

export type FinaleScreen = "welcome" | "opening" | "letter" | "finale";

export type FinaleProgress = {
  screen: FinaleScreen;
};

export const EMPTY_FINALE: FinaleProgress = {
  screen: "welcome",
};

let snapshot: FinaleProgress = EMPTY_FINALE;
let snapshotRaw: string | null = null;

function parseFinale(raw: string | null): FinaleProgress {
  if (!raw) {
    return EMPTY_FINALE;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<FinaleProgress>;
    const screen =
      parsed.screen === "welcome" ||
      parsed.screen === "opening" ||
      parsed.screen === "letter" ||
      parsed.screen === "finale"
        ? parsed.screen
        : "welcome";

    return { screen };
  } catch {
    return EMPTY_FINALE;
  }
}

export function subscribeFinale(onChange: () => void) {
  window.addEventListener(FINALE_EVENT, onChange);
  return () => window.removeEventListener(FINALE_EVENT, onChange);
}

export function readFinaleProgress(): FinaleProgress {
  if (typeof window === "undefined") {
    return EMPTY_FINALE;
  }

  const raw = window.sessionStorage.getItem(KEY);
  if (raw === snapshotRaw) {
    return snapshot;
  }

  snapshotRaw = raw;
  snapshot = parseFinale(raw);
  return snapshot;
}

export function writeFinaleProgress(progress: FinaleProgress): FinaleProgress {
  const raw = JSON.stringify(progress);
  window.sessionStorage.setItem(KEY, raw);
  snapshotRaw = raw;
  snapshot = progress;
  window.dispatchEvent(new CustomEvent(FINALE_EVENT, { detail: progress }));
  return progress;
}
