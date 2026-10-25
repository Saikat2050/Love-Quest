import { GAME, type RoundId } from "@/content/game";

export const PROGRESS_EVENT = "love-quest-progress";

export type Progress = {
  v: 2;
  completedRounds: RoundId[];
  unlockedHiddenNotes: string[];
  finished: boolean;
};

export const EMPTY_PROGRESS: Progress = {
  v: 2,
  completedRounds: [],
  unlockedHiddenNotes: [],
  finished: false,
};

function isRoundId(value: unknown): value is RoundId {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5 || value === 6 || value === 7;
}

let snapshot: Progress = EMPTY_PROGRESS;
let snapshotRaw: string | null = null;

function parseProgress(raw: string | null): Progress {
  if (!raw) {
    return EMPTY_PROGRESS;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<Progress>;
    let completedRounds = Array.isArray(parsed.completedRounds)
      ? parsed.completedRounds.filter(isRoundId)
      : [];

    if (parsed.v !== 2) {
      completedRounds = completedRounds.filter((id) => id !== 2);
    }

    return {
      v: 2,
      completedRounds,
      unlockedHiddenNotes: Array.isArray(parsed.unlockedHiddenNotes)
        ? parsed.unlockedHiddenNotes.filter((id): id is string => typeof id === "string")
        : [],
      finished: Boolean(parsed.finished),
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function readProgress(): Progress {
  if (typeof window === "undefined") {
    return EMPTY_PROGRESS;
  }

  const raw = window.localStorage.getItem(GAME.storageKey);
  if (raw === snapshotRaw) {
    return snapshot;
  }

  snapshotRaw = raw;
  snapshot = parseProgress(raw);
  return snapshot;
}

export function writeProgress(progress: Progress): Progress {
  const raw = JSON.stringify(progress);
  window.localStorage.setItem(GAME.storageKey, raw);
  snapshotRaw = raw;
  snapshot = progress;
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: progress }));
  return progress;
}

export function isRoundUnlocked(progress: Progress, id: RoundId): boolean {
  if (id === 1) {
    return true;
  }
  return progress.completedRounds.includes((id - 1) as RoundId);
}

export function isRoundCompleted(progress: Progress, id: RoundId): boolean {
  return progress.completedRounds.includes(id);
}

export function isCityUnlocked(progress: Progress): boolean {
  return progress.completedRounds.includes(7);
}

export function completeRound(progress: Progress, id: RoundId): Progress {
  if (progress.completedRounds.includes(id)) {
    return progress;
  }

  return writeProgress({
    ...progress,
    completedRounds: [...progress.completedRounds, id],
  });
}

export function unlockHiddenNote(progress: Progress, id: string): Progress {
  if (progress.unlockedHiddenNotes.includes(id)) {
    return progress;
  }

  return writeProgress({
    ...progress,
    unlockedHiddenNotes: [...progress.unlockedHiddenNotes, id],
  });
}

export function markFinished(progress: Progress): Progress {
  if (progress.finished) {
    return progress;
  }

  return writeProgress({
    ...progress,
    finished: true,
  });
}

export function resetProgress(): Progress {
  return writeProgress(EMPTY_PROGRESS);
}
