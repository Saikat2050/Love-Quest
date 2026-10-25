const KEY = "love-quest-chapter-6";
export const FUTURE_EVENT = "love-quest-chapter-6";

export type FutureScreen = "welcome" | "question" | "reveal" | "album";

export type FutureProgress = {
  index: number;
  picked: Record<string, "a" | "b" | "c" | "d">;
  screen: FutureScreen;
};

export const EMPTY_FUTURE: FutureProgress = {
  index: 0,
  picked: {},
  screen: "welcome",
};

let snapshot: FutureProgress = EMPTY_FUTURE;
let snapshotRaw: string | null = null;

function isOption(value: unknown): value is "a" | "b" | "c" | "d" {
  return value === "a" || value === "b" || value === "c" || value === "d";
}

function parseFuture(raw: string | null): FutureProgress {
  if (!raw) {
    return EMPTY_FUTURE;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<FutureProgress>;
    const index = [0, 1, 2, 3, 4].includes(parsed.index as number) ? (parsed.index as number) : 0;
    const picked: FutureProgress["picked"] = {};

    if (parsed.picked && typeof parsed.picked === "object") {
      for (const [key, value] of Object.entries(parsed.picked)) {
        if (isOption(value)) {
          picked[key] = value;
        }
      }
    }

    const screen =
      parsed.screen === "welcome" ||
      parsed.screen === "question" ||
      parsed.screen === "reveal" ||
      parsed.screen === "album"
        ? parsed.screen
        : "welcome";

    return { index, picked, screen };
  } catch {
    return EMPTY_FUTURE;
  }
}

export function subscribeFuture(onChange: () => void) {
  window.addEventListener(FUTURE_EVENT, onChange);
  return () => window.removeEventListener(FUTURE_EVENT, onChange);
}

export function readFutureProgress(): FutureProgress {
  if (typeof window === "undefined") {
    return EMPTY_FUTURE;
  }

  const raw = window.sessionStorage.getItem(KEY);
  if (raw === snapshotRaw) {
    return snapshot;
  }

  snapshotRaw = raw;
  snapshot = parseFuture(raw);
  return snapshot;
}

export function writeFutureProgress(progress: FutureProgress): FutureProgress {
  const raw = JSON.stringify(progress);
  window.sessionStorage.setItem(KEY, raw);
  snapshotRaw = raw;
  snapshot = progress;
  window.dispatchEvent(new CustomEvent(FUTURE_EVENT, { detail: progress }));
  return progress;
}
