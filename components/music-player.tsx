"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  getMusicSrc,
  readDuck,
  readMuted,
  readVolume,
  subscribeAudio,
  writeMuted,
  writeVolume,
} from "@/lib/audio";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const muted = useSyncExternalStore(subscribeAudio, readMuted, () => false);
  const volume = useSyncExternalStore(subscribeAudio, readVolume, () => 0.45);
  const duck = useSyncExternalStore(subscribeAudio, readDuck, () => 1);

  useEffect(() => {
    const node = audioRef.current;
    if (!node) {
      return;
    }

    node.loop = true;

    const play = () => {
      node.play().catch(() => {
        /* A first tap unlocks playback on phones. */
      });
    };

    const restart = () => {
      node.currentTime = 0;
      play();
    };

    play();
    node.addEventListener("ended", restart);
    window.addEventListener("pointerdown", play);

    return () => {
      node.removeEventListener("ended", restart);
      window.removeEventListener("pointerdown", play);
    };
  }, []);

  useEffect(() => {
    const node = audioRef.current;
    if (!node) {
      return;
    }
    node.volume = muted ? 0 : volume * duck;
  }, [duck, muted, volume]);

  const silent = muted || volume === 0;

  return (
    <div className="music-dock">
      <audio ref={audioRef} src={getMusicSrc()} loop preload="auto" />
      <button
        type="button"
        className="music-mute"
        aria-label={silent ? "Unmute the music" : "Mute the music"}
        onClick={() => {
          if (silent) {
            if (volume === 0) {
              writeVolume(0.45);
            }
            writeMuted(false);
            return;
          }
          writeMuted(true);
        }}
      >
        <span aria-hidden>{silent ? "♪" : "♫"}</span>
      </button>
      <label className="music-volume">
        <span className="music-volume-label">Volume</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.02"
          value={volume}
          onChange={(event) => writeVolume(Number(event.target.value))}
        />
      </label>
    </div>
  );
}
