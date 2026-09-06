"use client";

import { useEffect, useRef, useState } from "react";

// Pixel block sizes for the dissolve, large (blocky) -> 1 (sharp).
const STEPS = [40, 28, 18, 11, 6, 3, 1];
const SIZE = 300;

function drawInitials(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = "#0c1424";
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.strokeStyle = "rgba(94,234,212,0.28)";
  ctx.lineWidth = 2;
  ctx.strokeRect(6, 6, SIZE - 12, SIZE - 12);
  ctx.fillStyle = "#5eead4";
  ctx.font = "600 64px 'JetBrains Mono', ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("MM", SIZE / 2, SIZE / 2 + 4);
}

function drawPixelated(ctx: CanvasRenderingContext2D, img: HTMLImageElement, blockSize: number) {
  const small = Math.max(1, Math.round(SIZE / blockSize));
  const off = document.createElement("canvas");
  off.width = small;
  off.height = small;
  const octx = off.getContext("2d");
  if (!octx) return;
  octx.imageSmoothingEnabled = true;

  const { naturalWidth: iw, naturalHeight: ih } = img;
  const scale = Math.max(small / iw, small / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  octx.drawImage(img, (small - dw) / 2, (small - dh) / 2, dw, dh);

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.drawImage(off, 0, 0, small, small, 0, 0, SIZE, SIZE);
}

export default function PixelPortrait({ src, alt }: { src: string; alt: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const playDissolve = () => {
    const ctx = canvasRef.current?.getContext("2d");
    const img = imgRef.current;
    if (!ctx || !img) return;
    let i = 0;
    const tick = () => {
      drawPixelated(ctx, img, STEPS[i]);
      i++;
      if (i < STEPS.length) setTimeout(tick, i < 3 ? 150 : 90);
    };
    tick();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const img = new Image();
    imgRef.current = img;
    let startTimer: ReturnType<typeof setTimeout> | undefined;

    img.onload = () => {
      setReady(true);
      if (reduce) drawPixelated(ctx, img, 1);
      else startTimer = setTimeout(playDissolve, 300);
    };
    img.onerror = () => {
      setFailed(true);
      drawInitials(ctx);
    };
    img.src = src;

    return () => {
      if (startTimer) clearTimeout(startTimer);
    };
  }, [src]);

  return (
    <div className="portrait" onClick={() => ready && !failed && playDissolve()}>
      <div className="portrait-frame">
        <span className="corner corner-tl" aria-hidden="true" />
        <span className="corner corner-tr" aria-hidden="true" />
        <span className="corner corner-bl" aria-hidden="true" />
        <span className="corner corner-br" aria-hidden="true" />
        <canvas ref={canvasRef} role="img" aria-label={alt} className={failed ? undefined : "portrait-duotone"} />
      </div>
      <p className="portrait-caption">
        <b>&gt; whoami</b> — Mohasin Mudassar
      </p>
    </div>
  );
}
