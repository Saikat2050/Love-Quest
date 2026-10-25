import { AUDIO } from "@/content/game";

export const AUDIO_EVENT = "love-quest-audio";

const MUTE_KEY = "love-quest-audio-muted";
const VOLUME_KEY = "love-quest-audio-volume";
const DEFAULT_VOLUME = 0.45;

let duck = 1;

export type MusicSettings = {
  muted: boolean;
  volume: number;
};

function clampVolume(value: number): number {
  if (Number.isNaN(value)) {
    return DEFAULT_VOLUME;
  }
  return Math.min(1, Math.max(0, value));
}

export function readMuted(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.localStorage.getItem(MUTE_KEY) === "1";
}

export function readVolume(): number {
  if (typeof window === "undefined") {
    return DEFAULT_VOLUME;
  }
  const stored = window.localStorage.getItem(VOLUME_KEY);
  if (stored === null) {
    return DEFAULT_VOLUME;
  }
  return clampVolume(Number(stored));
}

export function writeMuted(muted: boolean): void {
  window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  window.dispatchEvent(new CustomEvent(AUDIO_EVENT));
}

export function writeVolume(volume: number): void {
  const next = clampVolume(volume);
  window.localStorage.setItem(VOLUME_KEY, String(next));
  if (next > 0) {
    window.localStorage.setItem(MUTE_KEY, "0");
  }
  window.dispatchEvent(new CustomEvent(AUDIO_EVENT));
}

export function getMusicSrc(): string {
  return AUDIO.music;
}

export function readDuck(): number {
  return duck;
}

export function writeDuck(value: number): void {
  const next = Number.isNaN(value) ? 1 : Math.min(1, Math.max(0, value));
  duck = next;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUDIO_EVENT));
  }
}

export function subscribeAudio(onChange: () => void): () => void {
  window.addEventListener(AUDIO_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(AUDIO_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
