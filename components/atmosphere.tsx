"use client";

import { useEffect, useRef } from "react";

type Firefly = {
  x: number;
  y: number;
  r: number;
  s: number;
  a: number;
  p: number;
};

export function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    let flies: Firefly[] = [];

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = reduce ? 10 : Math.min(42, Math.floor(window.innerWidth / 22));
      flies = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 0.6 + Math.random() * 1.6,
        s: 0.08 + Math.random() * 0.22,
        a: 0.15 + Math.random() * 0.45,
        p: Math.random() * Math.PI * 2,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      flies.forEach((fly) => {
        fly.p += 0.008;
        fly.y -= fly.s;
        fly.x += Math.sin(fly.p) * 0.28;
        if (fly.y < -8) {
          fly.y = window.innerHeight + 8;
          fly.x = Math.random() * window.innerWidth;
        }

        const pulse = reduce ? fly.a : fly.a * (0.55 + Math.sin(fly.p * 2) * 0.45);
        context.beginPath();
        context.fillStyle = `rgba(232, 200, 114, ${pulse})`;
        context.shadowBlur = 10;
        context.shadowColor = "rgba(232, 200, 114, 0.7)";
        context.arc(fly.x, fly.y, fly.r, 0, Math.PI * 2);
        context.fill();
      });
      context.shadowBlur = 0;
      frame = window.requestAnimationFrame(draw);
    };

    frame = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-10"
      />
      <div aria-hidden className="mist-sheet high" />
      <div aria-hidden className="mist-sheet" />
      <div aria-hidden className="grain" />
    </>
  );
}
