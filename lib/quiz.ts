import { CHAPTER_THREE, type MemoryQuestion } from "@/content/game";

export function pickMemorySet(count = CHAPTER_THREE.playCount): MemoryQuestion[] {
  const pool = [...CHAPTER_THREE.questions];

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = pool[i];
    const swap = pool[j];
    if (current === undefined || swap === undefined) {
      continue;
    }
    pool[i] = swap;
    pool[j] = current;
  }

  return pool.slice(0, count);
}
