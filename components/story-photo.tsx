"use client";

import { useCallback, useState } from "react";

export function StoryPhoto({
  src,
  alt = "",
  className = "",
  compact = false,
}: {
  src: string;
  alt?: string;
  className?: string;
  compact?: boolean;
}) {
  const [ready, setReady] = useState(false);

  const attach = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) {
      setReady(true);
    }
  }, []);

  return (
    <figure className={`${className}${compact ? " is-compact" : ""}${ready ? " is-ready" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={attach}
        src={src}
        alt={alt}
        decoding="async"
        onLoad={() => setReady(true)}
        onError={() => setReady(false)}
      />
    </figure>
  );
}
