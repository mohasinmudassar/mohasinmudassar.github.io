"use client";

import { useEffect, useRef, useState } from "react";

// Logical game-canvas coordinate space (CSS px) — the card scales this down
// on small screens, but all gameplay math stays in this space.
const W = 440;
const H = 300;

const LABELS = ["Downtime", "Misconfiguration", "OOMKilled", "Unused NAT Gateway", "Terraform Drift"];
const SHORT_LABELS: Record<string, string> = { Misconfiguration: "Config", OOMKilled: "OOM", "Unused NAT Gateway": "Idle NAT", "Terraform Drift": "Drift" };
const MIN_LINE_BUGS = 2;
const MAX_LINE_BUGS = 5;
const BUG_W = 46;
const BUG_H = 22;
const BUG_GAP = 16;
const BUG_TOP = 40;
const BUG_BOTTOM_LIMIT = H - 66; // line reaching here = incident

const PLAYER_W = 30;
const PLAYER_H = 16;
const PLAYER_Y = H - 34;
const PLAYER_SPEED = 5.5;

const BULLET_SPEED = 7.5;
const FIRE_COOLDOWN = 200; // ms

const KILL_SCORE = 10;
const LINE_CLEAR_BONUS = 20;

const GREEN = "94, 234, 212"; // --accent
const BLUE = "125, 211, 252"; // --sky
const ORANGE = "255, 138, 61"; // neon orange, local to this feature

type Bug = { label: string; baseX: number; alive: boolean };
type Bullet = { x: number; y: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };
type Status = "playing" | "lose";

// A fresh line of 2-5 bugs — no waves, no growing difficulty curve, just a
// new random-sized line every time the current one is cleared.
function spawnLine(): Bug[] {
  const count = MIN_LINE_BUGS + Math.floor(Math.random() * (MAX_LINE_BUGS - MIN_LINE_BUGS + 1));
  const total = count * BUG_W + (count - 1) * BUG_GAP;
  const startX = (W - total) / 2;
  return Array.from({ length: count }, (_, i) => ({
    label: LABELS[i % LABELS.length],
    baseX: startX + i * (BUG_W + BUG_GAP),
    alive: true,
  }));
}

function drawBug(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = `rgb(${ORANGE})`;
  ctx.fillRect(x + 9, y - 5, 2, 6);
  ctx.fillRect(x + BUG_W - 11, y - 5, 2, 6);
  ctx.fillRect(x + 8, y, BUG_W - 16, 7);
  ctx.fillRect(x + 3, y + 7, BUG_W - 6, 11);
  ctx.fillRect(x - 2, y + 9, 5, 4);
  ctx.fillRect(x + BUG_W - 3, y + 9, 5, 4);
  ctx.fillRect(x - 3, y + 16, 5, 3);
  ctx.fillRect(x + BUG_W - 2, y + 16, 5, 3);
  ctx.fillStyle = "#0b0f1a";
  ctx.fillRect(x + 13, y + 3, 3, 3);
  ctx.fillRect(x + BUG_W - 16, y + 3, 3, 3);
}

function drawShip(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = `rgb(${GREEN})`;
  ctx.fillRect(x + PLAYER_W / 2 - 2, y, 4, 6);
  ctx.fillRect(x + 5, y + 6, PLAYER_W - 10, 5);
  ctx.fillRect(x, y + 11, PLAYER_W, 5);
  ctx.fillRect(x - 3, y + 12, 3, 4);
  ctx.fillRect(x + PLAYER_W, y + 12, 3, 4);
  ctx.fillStyle = Math.random() > 0.5 ? `rgb(${ORANGE})` : "#ffd166";
  ctx.fillRect(x + PLAYER_W / 2 - 2, y + PLAYER_H, 4, 3 + Math.random() * 3);
}

export default function DevOpsInvaders() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const stepRef = useRef<() => void>(() => {});

  const playerXRef = useRef((W - PLAYER_W) / 2);
  const keysRef = useRef({ left: false, right: false });
  const draggingRef = useRef(false);
  const lastFireRef = useRef(0);
  const bulletsRef = useRef<Bullet[]>([]);
  // The first line's bug count is randomized — draw it once via useState's
  // lazy initializer so the ref and the displayed count agree.
  const [initialBugs] = useState(() => spawnLine());
  const bugsRef = useRef<Bug[]>(initialBugs);
  const formationRef = useRef({ x: 0, y: 0, dir: 1 });
  const particlesRef = useRef<Particle[]>([]);
  const statusRef = useRef<Status>("playing");
  const starsRef = useRef<{ x: number; y: number; r: number }[]>([]);

  const [status, setStatus] = useState<Status>("playing");
  const [bugsAlive, setBugsAlive] = useState(initialBugs.length);
  const [score, setScore] = useState(0);

  const spawnExplosion = (x: number, y: number) => {
    for (let i = 0; i < 10; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        life: 1,
        color: Math.random() > 0.5 ? ORANGE : GREEN,
      });
    }
  };

  const fire = () => {
    if (statusRef.current !== "playing") return;
    const now = performance.now();
    if (now - lastFireRef.current < FIRE_COOLDOWN) return;
    lastFireRef.current = now;
    bulletsRef.current.push({ x: playerXRef.current + PLAYER_W / 2 - 1, y: PLAYER_Y });
  };

  const reset = () => {
    playerXRef.current = (W - PLAYER_W) / 2;
    bulletsRef.current = [];
    bugsRef.current = spawnLine();
    formationRef.current = { x: 0, y: 0, dir: 1 };
    particlesRef.current = [];
    statusRef.current = "playing";
    keysRef.current = { left: false, right: false };
    setStatus("playing");
    setBugsAlive(bugsRef.current.length);
    setScore(0);
    canvasRef.current?.focus({ preventScroll: true });
    // The loop stops itself once the player dies — kick it back off.
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(stepRef.current);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = "9px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textAlign = "center";

    starsRef.current = Array.from({ length: 34 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() > 0.8 ? 1.4 : 0.8,
    }));

    const step = () => {
      // ---- update ----
      if (statusRef.current === "playing") {
        if (keysRef.current.left) playerXRef.current -= PLAYER_SPEED;
        if (keysRef.current.right) playerXRef.current += PLAYER_SPEED;
        playerXRef.current = Math.max(4, Math.min(W - PLAYER_W - 4, playerXRef.current));

        const bugs = bugsRef.current;
        const alive = bugs.filter((b) => b.alive);
        const formation = formationRef.current;
        // Speeds up as the current line thins out — resets with each new line.
        const killedFraction = bugs.length ? (bugs.length - alive.length) / bugs.length : 0;
        const speed = 0.55 + killedFraction * 1.6;
        formation.x += formation.dir * speed;
        if (alive.length) {
          const left = Math.min(...alive.map((b) => b.baseX)) + formation.x;
          const right = Math.max(...alive.map((b) => b.baseX + BUG_W)) + formation.x;
          if (right >= W - 6 || left <= 6) {
            formation.dir *= -1;
            formation.y += 12;
          }
        }

        if (BUG_TOP + formation.y + BUG_H >= BUG_BOTTOM_LIMIT) {
          statusRef.current = "lose";
          setStatus("lose");
        }

        bulletsRef.current = bulletsRef.current.filter((bullet) => {
          bullet.y -= BULLET_SPEED;
          if (bullet.y < -10) return false;
          for (const bug of bugs) {
            if (!bug.alive) continue;
            const bx = bug.baseX + formation.x;
            const by = BUG_TOP + formation.y;
            if (bullet.x > bx && bullet.x < bx + BUG_W && bullet.y > by && bullet.y < by + BUG_H) {
              bug.alive = false;
              spawnExplosion(bx + BUG_W / 2, by + BUG_H / 2);
              setScore((s) => s + KILL_SCORE);
              const remaining = bugs.filter((b) => b.alive).length;
              setBugsAlive(remaining);
              if (remaining <= 0) {
                setScore((s) => s + LINE_CLEAR_BONUS);
                bugsRef.current = spawnLine();
                formationRef.current = { x: 0, y: 0, dir: 1 };
                setBugsAlive(bugsRef.current.length);
              }
              return false;
            }
          }
          return true;
        });

        particlesRef.current = particlesRef.current.filter((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.045;
          return p.life > 0;
        });
      }

      // ---- draw ----
      ctx.fillStyle = "#05070f";
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "rgba(148, 178, 214, 0.35)";
      for (const s of starsRef.current) ctx.fillRect(s.x, s.y, s.r, s.r);

      const formation = formationRef.current;
      for (const bug of bugsRef.current) {
        if (!bug.alive) continue;
        const bx = bug.baseX + formation.x;
        const by = BUG_TOP + formation.y;
        drawBug(ctx, bx, by);
        ctx.fillStyle = `rgba(${ORANGE}, 0.85)`;
        ctx.fillText(SHORT_LABELS[bug.label] ?? bug.label, bx + BUG_W / 2, by - 9);
      }

      if (statusRef.current !== "lose") drawShip(ctx, playerXRef.current, PLAYER_Y);

      ctx.fillStyle = `rgb(${BLUE})`;
      for (const b of bulletsRef.current) ctx.fillRect(b.x, b.y, 2, 9);

      for (const p of particlesRef.current) {
        ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, p.life)})`;
        ctx.fillRect(p.x, p.y, 3, 3);
      }

      // Runs for as long as the player is alive; stops burning CPU/battery
      // the moment they lose instead of rendering a frozen scene forever.
      rafRef.current = statusRef.current === "playing" ? requestAnimationFrame(step) : null;
    };
    stepRef.current = step;

    const toLocalX = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return playerXRef.current;
      const scale = W / rect.width;
      return (clientX - rect.left) * scale - PLAYER_W / 2;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement !== canvas) return;
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keysRef.current.left = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keysRef.current.right = true;
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        fire();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keysRef.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keysRef.current.right = false;
    };
    const onPointerDown = (e: PointerEvent) => {
      canvas.focus({ preventScroll: true });
      draggingRef.current = true;
      playerXRef.current = Math.max(4, Math.min(W - PLAYER_W - 4, toLocalX(e.clientX)));
      fire();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      playerXRef.current = Math.max(4, Math.min(W - PLAYER_W - 4, toLocalX(e.clientX)));
    };
    const onPointerUp = () => {
      draggingRef.current = false;
    };
    const onBlur = () => {
      keysRef.current = { left: false, right: false };
      draggingRef.current = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("blur", onBlur);
    canvas.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("blur", onBlur);
      canvas.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return (
    <div className="invaders" ref={wrapRef}>
      <div className="invaders-hud">
        <span>SCORE {score} · BUGS {bugsAlive}</span>
        <span className="invaders-hint"><span className="keyboard-hint">← → / A D · SPACE or CLICK to fire</span><span className="touch-hint">Drag to move · Tap to fire</span></span>
      </div>
      <div className="invaders-screen">
        <canvas ref={canvasRef} tabIndex={0} role="img" aria-label={`DevOps Invaders. Move with left/right arrows or A/D and fire with Space. On touch screens, drag to move and tap to fire. New bugs keep coming — survive as long as you can. Current score ${score}.`} />
        {status === "lose" && (
          <div className="invaders-overlay invaders-lose">
            <p>INCIDENT DETECTED!</p>
            <p className="invaders-sub">PagerDuty alert triggered — final score {score}</p>
            <button type="button" className="btn btn-solid" onClick={reset}>
              Trigger rollback
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
