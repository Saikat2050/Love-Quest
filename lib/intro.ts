const EVENT = "love-quest-intro-done";

declare global {
  interface Window {
    __loveQuestIntroDone?: boolean;
    __loveQuestIntroGen?: number;
  }
}

export function readIntroDone(): boolean {
  if (window.__loveQuestIntroDone === true) {
    return true;
  }

  try {
    return window.sessionStorage.getItem("love-quest-seen-intro") === "1";
  } catch {
    return false;
  }
}

export function markIntroDone(): void {
  window.__loveQuestIntroDone = true;
  window.sessionStorage.setItem("love-quest-seen-intro", "1");
  window.dispatchEvent(new Event(EVENT));
}

export function resetIntro(): void {
  window.__loveQuestIntroDone = false;
  window.__loveQuestIntroGen = (window.__loveQuestIntroGen ?? 0) + 1;
  window.sessionStorage.removeItem("love-quest-seen-intro");
  window.dispatchEvent(new Event(EVENT));
}

export function readIntroGen(): number {
  return window.__loveQuestIntroGen ?? 0;
}

export function subscribeIntro(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}
