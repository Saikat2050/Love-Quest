const KEY = "love-quest-chapter-5";
export const HEART_EVENT = "love-quest-chapter-5";

export type HeartScreen = "welcome" | "play" | "finale";

export type HeartProgress = {
  collected: number[];
  screen: HeartScreen;
};

export const EMPTY_HEART: HeartProgress = {
  collected: [],
  screen: "welcome",
};

let snapshot: HeartProgress = EMPTY_HEART;
let snapshotRaw: string | null = null;

function parseHeart(raw: string | null): HeartProgress {
  if (!raw) {
    return EMPTY_HEART;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<HeartProgress>;
    const collected = Array.isArray(parsed.collected)
      ? parsed.collected.filter((id): id is number => Number.isInteger(id) && id >= 0 && id < 10)
      : [];
    const unique = [...new Set(collected)];
    const screen =
      parsed.screen === "welcome" || parsed.screen === "play" || parsed.screen === "finale"
        ? parsed.screen
        : "welcome";

    return {
      collected: unique,
      screen: unique.length >= 10 && screen === "play" ? "finale" : screen,
    };
  } catch {
    return EMPTY_HEART;
  }
}

export function subscribeHeart(onChange: () => void) {
  window.addEventListener(HEART_EVENT, onChange);
  return () => window.removeEventListener(HEART_EVENT, onChange);
}

export function readHeartProgress(): HeartProgress {
  if (typeof window === "undefined") {
    return EMPTY_HEART;
  }

  const raw = window.sessionStorage.getItem(KEY);
  if (raw === snapshotRaw) {
    return snapshot;
  }

  snapshotRaw = raw;
  snapshot = parseHeart(raw);
  return snapshot;
}

export function writeHeartProgress(progress: HeartProgress): HeartProgress {
  const raw = JSON.stringify(progress);
  window.sessionStorage.setItem(KEY, raw);
  snapshotRaw = raw;
  snapshot = progress;
  window.dispatchEvent(new CustomEvent(HEART_EVENT, { detail: progress }));
  return progress;
}
