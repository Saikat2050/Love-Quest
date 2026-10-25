import * as story from "@/content/game";
import { OPTIONAL_MEDIA, PUBLIC_MEDIA } from "@/lib/public-media";

const MEDIA = /^\/(images|audio)\//;

export function collectStoryAssets(): string[] {
  const found = new Set<string>();
  walk(story, found);

  return [...found]
    .filter((url) => PUBLIC_MEDIA.has(url) && !OPTIONAL_MEDIA.has(url))
    .sort((left, right) => {
      if (left.includes("opening")) {
        return -1;
      }
      if (right.includes("opening")) {
        return 1;
      }
      if (left.startsWith("/audio/")) {
        return -1;
      }
      if (right.startsWith("/audio/")) {
        return 1;
      }
      return left.localeCompare(right);
    });
}

function walk(value: unknown, found: Set<string>) {
  if (typeof value === "string") {
    if (MEDIA.test(value)) {
      found.add(value);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => walk(item, found));
    return;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => walk(item, found));
  }
}
