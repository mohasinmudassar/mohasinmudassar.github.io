"use client";

import { useEffect, useRef, useState } from "react";

// ASCII ramp, sparse -> dense. Density is driven by brightness (brighter
// pixel = denser glyph), not darkness — that's what makes lit skin/highlight
// areas read as the "detailed" part of the portrait and hair/shadow fall
// away to sparse dots. Formula ported from a reference dot-portrait effect.
const CHARS = " .:-=+*#%@".split("");
const ACCENT = "94, 234, 212";
const SCALE = 0.8; // fraction of the canvas the image is drawn into
const REPEL_RADIUS_RATIO = 0.22; // fraction of canvas size
const REPEL_FORCE = 5;
const MOUSE_EASE = 0.15;
const ALPHA_MIN = 128; // 0-255 — cells below this are treated as background
// Treats near-black pixels as background too, not just transparent ones —
// keeps opaque source photos (e.g. a JPEG shot against a dark backdrop)
// from spawning a particle for every pixel in the frame, which is what
// actually caused the animation to feel laggy.
const BRIGHTNESS_MIN = 0.06;
const BURST_RADIUS_RATIO = 0.35;
const BURST_FORCE = 14;

type Particle = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  char: string;
  baseAlpha: number;
  currentAlpha: number;
  delay: number;
  shimmer: number;
};

function fontSizeFor(size: number) {
  return size <= 240 ? 5 : 7;
}

function buildParticles(img: HTMLImageElement, size: number): Particle[] {
  const off = document.createElement("canvas");
  off.width = size;
  off.height = size;
  const octx = off.getContext("2d", { willReadFrequently: true });
  if (!octx) return [];

  const imgAspect = (img.naturalWidth || 1) / (img.naturalHeight || 1);
  let drawHeight = size * SCALE;
  let drawWidth = drawHeight * imgAspect;
  if (drawWidth > size * SCALE) {
    drawWidth = size * SCALE;
    drawHeight = drawWidth / imgAspect;
  }
  const offsetX = (size - drawWidth) / 2;
  const offsetY = (size - drawHeight) / 2;
  octx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

  const { data } = octx.getImageData(0, 0, size, size);
  const fontSize = fontSizeFor(size);
  const colGap = fontSize * 0.7;
  const rowGap = fontSize * 1.1;

  const particles: Particle[] = [];
  for (let y = 0; y < size; y += rowGap) {
    for (let x = 0; x < size; x += colGap) {
      const i = (Math.floor(y) * size + Math.floor(x)) * 4;
      const a = data[i + 3];
      if (a <= ALPHA_MIN) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / (3 * 255);
      if (brightness <= BRIGHTNESS_MIN) continue;
      const char = CHARS[Math.floor(brightness * (CHARS.length - 1))];
      const baseAlpha = 0.4 + brightness * 0.6;

      particles.push({
        x: x + (Math.random() - 0.5) * 400,
        y: y + (Math.random() - 0.5) * 400,
        targetX: x,
        targetY: y,
        vx: 0,
        vy: 0,
        char,
        baseAlpha,
        currentAlpha: 0,
        delay: Math.random() * 0.4,
        shimmer: Math.random() * Math.PI * 2,
      });
    }
  }
  return particles;
}

export default function AsciiPortrait({ src, alt }: { src: string; alt: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const loadedSrcRef = useRef<string | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const startTimeRef = useRef(0);
  const sizeRef = useRef(300);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const mouseTargetRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  const [size, setSize] = useState(300);

  // Track the wrapper's actual rendered size so the grid always matches
  // the real display size — regenerating a CSS-scaled canvas avoids blur.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (!w) return;
      setSize((prev) => (Math.abs(prev - w) > 6 ? Math.round(w) : prev));
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  // (Re)build the canvas backing store and particle grid whenever the
  // image or the rendered size changes.
  useEffect(() => {
    sizeRef.current = size;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const apply = (img: HTMLImageElement) => {
      particlesRef.current = buildParticles(img, size);
      startTimeRef.current = performance.now();
    };

    if (imgRef.current && loadedSrcRef.current === src) {
      apply(imgRef.current);
      return;
    }
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      loadedSrcRef.current = src;
      apply(img);
    };
    img.src = src;
  }, [src, size]);

  // Animation loop + pointer/touch handling — set up once, reads current
  // state through refs so it never needs to restart on resize.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      const size = sizeRef.current;
      ctx.clearRect(0, 0, size, size);

      const particles = particlesRef.current;
      if (!particles.length || !visibleRef.current) return;

      const mouse = mouseRef.current;
      const target = mouseTargetRef.current;
      mouse.x += (target.x - mouse.x) * MOUSE_EASE;
      mouse.y += (target.y - mouse.y) * MOUSE_EASE;

      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      const fontSize = fontSizeFor(size);
      ctx.font = `${fontSize}px 'JetBrains Mono', ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const maxDist = size * REPEL_RADIUS_RATIO;

      for (const p of particles) {
        if (reduce) {
          p.x = p.targetX;
          p.y = p.targetY;
          ctx.fillStyle = `rgba(${ACCENT}, ${p.baseAlpha})`;
          ctx.fillText(p.char, p.x, p.y);
          continue;
        }

        const particleTime = elapsed - p.delay;
        if (particleTime < 0) continue;

        const fadeProgress = Math.min(particleTime / 1.5, 1);
        const easedFade = 1 - Math.pow(1 - fadeProgress, 2);
        const isActive = mouse.active || particleTime < 3.0;
        const shimmerVal = isActive ? Math.sin(elapsed * 2 + p.shimmer) * 0.1 : 0;
        p.currentAlpha = Math.max(0, p.baseAlpha * easedFade + shimmerVal);

        const moveProgress = Math.min(particleTime / 2.5, 1);
        const easedMove = 1 - Math.pow(1 - moveProgress, 3);

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * REPEL_FORCE;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const pullStrength = 0.01 + easedMove * 0.08;
        p.vx += dx * pullStrength;
        p.vy += dy * pullStrength;

        if (isActive) {
          p.vx += Math.sin(elapsed * 0.5 + p.targetY * 0.1) * 0.15;
          p.vy += Math.cos(elapsed * 0.5 + p.targetX * 0.1) * 0.15;
          p.vx *= 0.92;
          p.vy *= 0.92;
        } else {
          p.vx *= 0.85;
          p.vy *= 0.85;
          if (particleTime > 4.0 && Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
            p.x = p.targetX;
            p.y = p.targetY;
            p.vx = 0;
            p.vy = 0;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.currentAlpha <= 0.02) continue;
        ctx.fillStyle = `rgba(${ACCENT}, ${p.currentAlpha})`;
        ctx.fillText(p.char, p.x, p.y);
      }
    };

    const toLocal = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const handlePointerMove = (e: PointerEvent) => {
      const p = toLocal(e.clientX, e.clientY);
      mouseTargetRef.current = p;
      mouseRef.current.active = true;
    };
    const handleLeave = () => {
      mouseRef.current.active = false;
      mouseTargetRef.current = { x: -1000, y: -1000 };
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const p = toLocal(touch.clientX, touch.clientY);
      mouseTargetRef.current = p;
      mouseRef.current.active = true;
      if (e.cancelable) e.preventDefault();
    };

    // A one-off outward impulse on click/tap, on top of the continuous
    // hover repel — gives the portrait a satisfying "poke" instead of only
    // reacting while the pointer keeps moving.
    const burst = (x: number, y: number) => {
      const size = sizeRef.current;
      const radius = size * BURST_RADIUS_RATIO;
      for (const p of particlesRef.current) {
        const dx = p.x - x;
        const dy = p.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist >= radius || dist <= 0) continue;
        const force = (1 - dist / radius) * BURST_FORCE;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    };
    const handlePointerDown = (e: PointerEvent) => {
      const p = toLocal(e.clientX, e.clientY);
      burst(p.x, p.y);
    };
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const p = toLocal(touch.clientX, touch.clientY);
      burst(p.x, p.y);
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handleLeave);
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchend", handleLeave);

    const io = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    if (wrapRef.current) io.observe(wrapRef.current);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      io.disconnect();
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handleLeave);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleLeave);
    };
  }, []);

  return (
    <div className="portrait" ref={wrapRef}>
      <canvas ref={canvasRef} role="img" aria-label={alt} />
      <p className="portrait-caption">
        <b>&gt; whoami</b> — <TypedName />
      </p>
    </div>
  );
}

const GREETING = "Hi, Mosh here.";

function TypedName() {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = setTimeout(() => setTyped(GREETING), 0);
      return () => clearTimeout(timer);
    }
    let i = 0;
    let deleting = false;

    const tick = () => {
      if (!deleting) {
        i++;
        setTyped(GREETING.slice(0, i));
        if (i >= GREETING.length) {
          deleting = true;
          timer = setTimeout(tick, 2200);
          return;
        }
      } else {
        i--;
        setTyped(GREETING.slice(0, i));
        if (i <= 0) {
          deleting = false;
          timer = setTimeout(tick, 500);
          return;
        }
      }
      timer = setTimeout(tick, deleting ? 28 : 60);
    };

    timer = setTimeout(tick, 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className="tw">
      {typed}
      <span className="caret" />
    </span>
  );
}
