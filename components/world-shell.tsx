"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Atmosphere } from "@/components/atmosphere";
import { BootLoader } from "@/components/boot-loader";
import { MusicPlayer } from "@/components/music-player";
import { Preloader } from "@/components/preloader";
import { ProgressProvider } from "@/components/progress-provider";
import { readBootReady, subscribeBoot } from "@/lib/boot";
import {
  markIntroDone,
  readIntroDone,
  readIntroGen,
  subscribeIntro,
} from "@/lib/intro";

export function WorldShell({ children }: { children: React.ReactNode }) {
  const bootReady = useSyncExternalStore(subscribeBoot, readBootReady, () => false);
  const introDone = useSyncExternalStore(subscribeIntro, readIntroDone, () => false);
  const introGen = useSyncExternalStore(subscribeIntro, readIntroGen, () => 0);
  const path = usePathname();
  const letterChapter = path === "/round/1";
  const puzzleChapter = path === "/round/2";
  const memoryChapter = path === "/round/3";
  const specialChapter = path === "/round/4";
  const heartChapter = path === "/round/5";
  const futureChapter = path === "/round/6";
  const unlockChapter = path === "/round/7" || path === "/ending";
  const ownWorld =
    letterChapter ||
    puzzleChapter ||
    memoryChapter ||
    specialChapter ||
    heartChapter ||
    futureChapter ||
    unlockChapter;

  return (
    <ProgressProvider>
      {bootReady ? <MusicPlayer /> : null}
      <div
        className={`relative isolate ${letterChapter ? "bg-[#fff7f5]" : puzzleChapter ? "bg-[#f7e6ef]" : memoryChapter ? "bg-[#f4d6e4]" : specialChapter ? "bg-[#fff4ea]" : heartChapter ? "bg-[#1b1030]" : futureChapter ? "bg-[#fff4ea]" : unlockChapter ? "bg-[#140c24]" : "world"}`}
      >
        {!bootReady ? (
          <BootLoader />
        ) : introDone ? (
          <>
            {ownWorld ? null : <Atmosphere />}
            <div className="relative z-20">{children}</div>
          </>
        ) : (
          <Preloader key={introGen} onDone={markIntroDone} />
        )}
      </div>
    </ProgressProvider>
  );
}
