const KEY = "love-quest-chapter-4";
export const SPECIAL_EVENT = "love-quest-chapter-4";

export type SpecialScreen = "welcome" | "keys" | "unlocking" | "reveal" | "album";

export type SpecialProgress = {
  unlocked: number;
  screen: SpecialScreen;
  viewing: number;
};

export const EMPTY_SPECIAL: SpecialProgress = {
  unlocked: 0,
  screen: "welcome",
  viewing: 0,
};

let snapshot: SpecialProgress = EMPTY_SPECIAL;
let snapshotRaw: string | null = null;

function parseSpecial(raw: string | null): SpecialProgress {
  if (!raw) {
    return EMPTY_SPECIAL;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<SpecialProgress>;
    const unlocked = [0, 1, 2, 3].includes(parsed.unlocked as number)
      ? (parsed.unlocked as number)
      : 0;
    const viewing = [0, 1, 2].includes(parsed.viewing as number)
      ? (parsed.viewing as number)
      : 0;
    const screen =
      parsed.screen === "welcome" ||
      parsed.screen === "keys" ||
      parsed.screen === "unlocking" ||
      parsed.screen === "reveal" ||
      parsed.screen === "album"
        ? parsed.screen
        : "welcome";

    return {
      unlocked,
      viewing,
      screen: screen === "unlocking" ? "keys" : screen,
    };
  } catch {
    return EMPTY_SPECIAL;
  }
}

export function subscribeSpecial(onChange: () => void) {
  window.addEventListener(SPECIAL_EVENT, onChange);
  return () => window.removeEventListener(SPECIAL_EVENT, onChange);
}

export function readSpecialProgress(): SpecialProgress {
  if (typeof window === "undefined") {
    return EMPTY_SPECIAL;
  }

  const raw = window.sessionStorage.getItem(KEY);
  if (raw === snapshotRaw) {
    return snapshot;
  }

  snapshotRaw = raw;
  snapshot = parseSpecial(raw);
  return snapshot;
}

export function writeSpecialProgress(progress: SpecialProgress): SpecialProgress {
  const raw = JSON.stringify(progress);
  window.sessionStorage.setItem(KEY, raw);
  snapshotRaw = raw;
  snapshot = progress;
  window.dispatchEvent(new CustomEvent(SPECIAL_EVENT, { detail: progress }));
  return progress;
}
