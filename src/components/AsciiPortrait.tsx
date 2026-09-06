"use client";

import { useEffect, useRef } from "react";

// Character ramp, sparse -> dense. Density comes from how dark a cell is
// plus how much local contrast it has, so eyes/beard/hair edges (the
// highest-detail parts of a portrait) naturally read as the densest glyphs.
const RAMP = [".", ".", ":", "-", "=", "+", "*", "#"];

const SIZE = 320; // logical canvas coordinate space, in CSS px
const COLS = 52; // grid columns across the image's contained width
const ALPHA_MIN = 40; // 0-255 — cells below this are treated as background
const IDLE_AMP = 2; // px, gentle idle sway so the field never looks frozen
const PUSH_RADIUS = 80; // px, cursor influence radius
const PUSH_STRENGTH = 20; // px, max radial push right at the cursor
const SWIRL_STRENGTH = 28; // px, max tangential swirl right at the cursor
const EASE = 0.14; // spring catch-up rate per frame — lower = more trailing

type Particle = {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  char: string;
  opacity: number;
};

function buildParticles(img: HTMLImageElement): Particle[] {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return [];
  const ar = iw / ih;
  const drawW = ar >= 1 ? SIZE : SIZE * ar;
  const drawH = ar >= 1 ? SIZE / ar : SIZE;
  const offX = (SIZE - drawW) / 2;
  const offY = (SIZE - drawH) / 2;

  const sw = Math.max(1, Math.round(drawW));
  const sh = Math.max(1, Math.round(drawH));
  const off = document.createElement("canvas");
  off.width = sw;
  off.height = sh;
  const octx = off.getContext("2d", { willReadFrequently: true });
  if (!octx) return [];
  octx.drawImage(img, 0, 0, sw, sh);
  const { data } = octx.getImageData(0, 0, sw, sh);

  const cell = drawW / COLS;
  const rows = Math.max(1, Math.round(drawH / cell));
  const sample = Math.max(1, Math.floor(cell / 2));

  const particles: Particle[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < COLS; col++) {
      const cx = Math.round((col + 0.5) * cell);
      const cy = Math.round((row + 0.5) * cell);

      let aSum = 0;
      let lSum = 0;
      let lMin = 1;
      let lMax = 0;
      let n = 0;
      for (let dy = -sample; dy <= sample; dy += sample) {
        for (let dx = -sample; dx <= sample; dx += sample) {
          const px = cx + dx;
          const py = cy + dy;
          if (px < 0 || py < 0 || px >= sw || py >= sh) continue;
          const idx = (py * sw + px) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];
          const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          aSum += a;
          lSum += lum;
          if (lum < lMin) lMin = lum;
          if (lum > lMax) lMax = lum;
          n++;
        }
      }
      if (n === 0) continue;
      if (aSum / n < ALPHA_MIN) continue;

      const meanLum = lSum / n;
      const detail = lMax - lMin;
      const density = Math.min(1, Math.max(0, (1 - meanLum) * 0.55 + detail * 1.6));
      const char = RAMP[Math.min(RAMP.length - 1, Math.floor(density * RAMP.length))];
      const opacity = 0.3 + density * 0.6;

      const homeX = offX + cx;
      const homeY = offY + cy;
      // Entrance: particles start scattered and the spring-ease in the
      // render loop pulls them home, giving a free "assemble" animation.
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 90;
      particles.push({
        homeX,
        homeY,
        x: homeX + Math.cos(angle) * dist,
        y: homeY + Math.sin(angle) * dist,
        char,
        opacity,
      });
    }
  }
  return particles;
}

export default function AsciiPortrait({ src, alt }: { src: string; alt: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[] | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.font = "7px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ACCENT = "94, 234, 212";
    let start = 0;

    const drawFrame = (t: number) => {
      const particles = particlesRef.current;
      if (!particles) return;
      ctx.clearRect(0, 0, SIZE, SIZE);
      const pointer = pointerRef.current;
      for (const p of particles) {
        let tx = p.homeX + Math.sin(p.homeY * 0.045 + t * 0.6) * IDLE_AMP;
        let ty = p.homeY + Math.cos(p.homeX * 0.045 + t * 0.5) * IDLE_AMP;
        let boost = 0;

        if (pointer.active) {
          const dx = p.homeX - pointer.x;
          const dy = p.homeY - pointer.y;
          const dist = Math.hypot(dx, dy) || 0.0001;
          if (dist < PUSH_RADIUS) {
            const force = 1 - dist / PUSH_RADIUS;
            const eased = force * force;
            const nx = dx / dist;
            const ny = dy / dist;
            // radial push (away from cursor) + tangential swirl
            tx += nx * eased * PUSH_STRENGTH + -ny * eased * SWIRL_STRENGTH;
            ty += ny * eased * PUSH_STRENGTH + nx * eased * SWIRL_STRENGTH;
            boost = eased;
          }
        }

        if (reduce) {
          p.x = p.homeX;
          p.y = p.homeY;
        } else {
          p.x += (tx - p.x) * EASE;
          p.y += (ty - p.y) * EASE;
        }

        const op = Math.min(1, p.opacity + boost * 0.4);
        ctx.fillStyle = `rgba(${ACCENT}, ${op})`;
        ctx.fillText(p.char, p.x, p.y);
      }
    };

    const loop = (ts: number) => {
      if (!start) start = ts;
      drawFrame((ts - start) / 1000);
      rafRef.current = requestAnimationFrame(loop);
    };

    const runOnce = () => drawFrame(0);

    const startLoop = () => {
      if (rafRef.current != null) return;
      if (reduce) runOnce();
      else rafRef.current = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const img = new Image();
    img.onload = () => {
      particlesRef.current = buildParticles(img);
      startLoop();
    };
    img.onerror = () => {
      ctx.fillStyle = `rgba(${ACCENT}, 0.5)`;
      ctx.font = "600 48px 'JetBrains Mono', ui-monospace, monospace";
      ctx.fillText("MM", SIZE / 2, SIZE / 2);
    };
    img.src = src;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) startLoop();
        else stopLoop();
      },
      { threshold: 0.05 }
    );
    if (wrapRef.current) io.observe(wrapRef.current);

    return () => {
      stopLoop();
      io.disconnect();
    };
  }, [src]);

  const toLocal = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return null;
    const scale = SIZE / rect.width;
    return { x: (clientX - rect.left) * scale, y: (clientY - rect.top) * scale };
  };

  return (
    <div className="portrait" ref={wrapRef}>
      <div className="portrait-frame">
        <span className="corner corner-tl" aria-hidden="true" />
        <span className="corner corner-tr" aria-hidden="true" />
        <span className="corner corner-bl" aria-hidden="true" />
        <span className="corner corner-br" aria-hidden="true" />
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={alt}
          onPointerMove={(e) => {
            if (e.pointerType === "touch") return;
            const p = toLocal(e.clientX, e.clientY);
            if (p) pointerRef.current = { ...p, active: true };
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "touch") return;
            pointerRef.current.active = false;
          }}
        />
      </div>
      <p className="portrait-caption">
        <b>&gt; whoami</b> — Mohasin Mudassar
      </p>
    </div>
  );
}
