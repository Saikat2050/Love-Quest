import { FIRST_SCREEN_MEDIA } from "@/lib/public-media";

const EVENT = "love-quest-boot-ready";
const IMAGE = /\.(avif|gif|jpe?g|png|webp)$/i;
const SOUND = /\.(m4a|mp3|ogg|wav)$/i;
const WORKERS = 2;
const ATTEMPTS = 3;
const FETCH_MS = 120000;

declare global {
  interface Window {
    __loveQuestBootReady?: boolean;
    __loveQuestImages?: Map<string, HTMLImageElement>;
    __loveQuestAudio?: Map<string, HTMLAudioElement>;
  }
}

export function readBootReady(): boolean {
  return window.__loveQuestBootReady === true;
}

export function markBootReady(): void {
  window.__loveQuestBootReady = true;
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeBoot(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

export async function preloadStoryAssets(
  urls: string[],
  onProgress: (done: number, total: number) => void,
): Promise<void> {
  const queue = [...urls];
  let total = Math.max(queue.length, 1);
  let done = 0;
  onProgress(0, total);

  const workers = Array.from({ length: Math.min(WORKERS, queue.length || 1) }, async () => {
    while (queue.length > 0) {
      const url = queue.shift();
      if (!url) {
        break;
      }

      const result = await loadOne(url);
      if (result === "missing") {
        total = Math.max(done, total - 1);
        onProgress(done, total);
        continue;
      }

      done += 1;
      onProgress(done, total);
    }
  });

  await Promise.all(workers);
  onProgress(done, Math.max(done, 1));
}

function imageCache(): Map<string, HTMLImageElement> {
  if (!window.__loveQuestImages) {
    window.__loveQuestImages = new Map();
  }
  return window.__loveQuestImages;
}

function audioCache(): Map<string, HTMLAudioElement> {
  if (!window.__loveQuestAudio) {
    window.__loveQuestAudio = new Map();
  }
  return window.__loveQuestAudio;
}

async function loadOne(url: string): Promise<"ok" | "missing"> {
  for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
    const result = await fetchMedia(url);
    if (result === "ok" || result === "missing") {
      return result;
    }
    await wait(400 * (attempt + 1));
  }
  return "missing";
}

async function fetchMedia(url: string): Promise<"ok" | "missing" | "retry"> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), FETCH_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      credentials: "same-origin",
      cache: "force-cache",
      mode: "same-origin",
    });

    if (response.status === 404 || response.status === 410 || response.status === 403) {
      return "missing";
    }
    if (!response.ok) {
      return "retry";
    }

    const type = (response.headers.get("content-type") || "").toLowerCase();
    if (type.includes("text/html") || type.includes("application/json") || type.includes("text/plain")) {
      return "missing";
    }
    if (IMAGE.test(url) && type && !type.startsWith("image/") && !type.includes("octet-stream")) {
      return "missing";
    }
    if (SOUND.test(url) && type && !type.startsWith("audio/") && !type.includes("octet-stream")) {
      return "missing";
    }

    const blob = await response.blob();
    if (blob.size < 64) {
      return "missing";
    }

    if (IMAGE.test(url) && FIRST_SCREEN_MEDIA.has(url)) {
      await pinImage(url);
    }
    if (SOUND.test(url)) {
      pinAudio(url);
    }

    return "ok";
  } catch {
    return "retry";
  } finally {
    window.clearTimeout(timer);
  }
}

function pinImage(url: string): Promise<void> {
  const cache = imageCache();
  const held = cache.get(url);
  if (held?.complete && held.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    let settled = false;
    const finish = () => {
      if (settled) {
        return;
      }
      settled = true;
      cache.set(url, image);
      resolve();
    };
    image.onload = finish;
    image.onerror = finish;
    image.src = url;
  });
}

function pinAudio(url: string): void {
  const cache = audioCache();
  if (cache.has(url)) {
    return;
  }
  const sound = new Audio();
  sound.preload = "auto";
  sound.src = url;
  cache.set(url, sound);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
