"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { RoundId } from "@/content/game";
import {
  completeRound,
  EMPTY_PROGRESS,
  isCityUnlocked,
  isRoundCompleted,
  isRoundUnlocked,
  markFinished,
  PROGRESS_EVENT,
  readProgress,
  resetProgress,
  type Progress,
  unlockHiddenNote,
} from "@/lib/progress";

type ProgressApi = {
  progress: Progress;
  ready: boolean;
  isUnlocked: (id: RoundId) => boolean;
  isCompleted: (id: RoundId) => boolean;
  cityUnlocked: boolean;
  complete: (id: RoundId) => void;
  unlockNote: (id: string) => void;
  finish: () => void;
  reset: () => void;
};

const ProgressContext = createContext<ProgressApi | null>(null);

function subscribe(onChange: () => void) {
  window.addEventListener(PROGRESS_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const progress = useSyncExternalStore(subscribe, readProgress, () => EMPTY_PROGRESS);
  const ready = useIsClient();

  const complete = useCallback((id: RoundId) => {
    completeRound(readProgress(), id);
  }, []);

  const unlockNote = useCallback((id: string) => {
    unlockHiddenNote(readProgress(), id);
  }, []);

  const finish = useCallback(() => {
    markFinished(readProgress());
  }, []);

  const reset = useCallback(() => {
    resetProgress();
  }, []);

  const value = useMemo<ProgressApi>(
    () => ({
      progress,
      ready,
      isUnlocked: (id) => isRoundUnlocked(progress, id),
      isCompleted: (id) => isRoundCompleted(progress, id),
      cityUnlocked: isCityUnlocked(progress),
      complete,
      unlockNote,
      finish,
      reset,
    }),
    [complete, finish, progress, ready, reset, unlockNote],
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }
  return context;
}
