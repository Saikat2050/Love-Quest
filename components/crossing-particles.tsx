"use client";

import { useEffect, useRef } from "react";

type CrossingParticlesProps = {
  magic: number;
};

type Speck = {
  x: number;
  y: number;
  r: number;
  s: number;
  p: number;
  kind: "rain" | "fly" | "petal";
};

export function CrossingParticles({ magic }: CrossingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const magicRef = useRef(magic);
  magicRef.current = magic;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let specks: Speck[] = [];

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = reduce ? 14 : Math.min(70, Math.floor(window.innerWidth / 14));
      specks = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 0.5 + Math.random() * 1.8,
        s: 0.4 + Math.random() * 2.2,
        p: Math.random() * Math.PI * 2,
        kind: index % 11 === 0 ? "petal" : index % 3 === 0 ? "fly" : "rain",
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const m = magicRef.current;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      specks.forEach((speck) => {
        speck.p += 0.012;
        const rainWeight = 1 - m;
        const flyWeight = m;

        if (speck.kind === "rain" && rainWeight > 0.08) {
          speck.y += speck.s * (2.4 + rainWeight * 2);
          speck.x += 0.25;
          if (speck.y > window.innerHeight + 8) {
            speck.y = -8;
            speck.x = Math.random() * window.innerWidth;
          }
          context.strokeStyle = `rgba(180, 188, 196, ${0.12 + rainWeight * 0.22})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(speck.x, speck.y);
          context.lineTo(speck.x - 1.2, speck.y + 10);
          context.stroke();
        }

        if (speck.kind === "fly" && flyWeight > 0.12) {
          speck.y -= speck.s * 0.22;
          speck.x += Math.sin(speck.p) * 0.35;
          if (speck.y < -8) {
            speck.y = window.innerHeight + 8;
            speck.x = Math.random() * window.innerWidth;
          }
          const pulse = 0.2 + Math.sin(speck.p * 2) * 0.35;
          context.fillStyle = `rgba(232, 200, 114, ${flyWeight * pulse})`;
          context.shadowBlur = 12 * flyWeight;
          context.shadowColor = "rgba(232, 200, 114, 0.7)";
          context.beginPath();
          context.arc(speck.x, speck.y, speck.r, 0, Math.PI * 2);
          context.fill();
          context.shadowBlur = 0;
        }

        if (speck.kind === "petal" && flyWeight > 0.35) {
          speck.y += 0.28 + Math.sin(speck.p) * 0.2;
          speck.x += Math.cos(speck.p * 0.6) * 0.45;
          if (speck.y > window.innerHeight + 10) {
            speck.y = -10;
            speck.x = Math.random() * window.innerWidth;
          }
          context.save();
          context.translate(speck.x, speck.y);
          context.rotate(speck.p);
          context.fillStyle = `rgba(196, 92, 106, ${0.18 + flyWeight * 0.28})`;
          context.beginPath();
          context.ellipse(0, 0, 3.4, 1.6, 0, 0, Math.PI * 2);
          context.fill();
          context.restore();
        }
      });

      frame = window.requestAnimationFrame(draw);
    };

    frame = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10"
    />
  );
}
