"use client";

import { useEffect, useRef, useState } from "react";

// Logical game-canvas coordinate space (CSS px) — the card scales this down
// on small screens, but all gameplay math stays in this space.
const W = 440;
const H = 300;

const LABELS = ["Downtime", "Misconfiguration", "OOMKilled", "Unused NAT Gateway", "Terraform Drift"];
const BUG_W = 46;
const BUG_H = 22;
const BUG_GAP = 16;
const BUG_TOP = 40;
const BUG_BOTTOM_LIMIT = H - 66; // formation reaching here = incident

const PLAYER_W = 30;
const PLAYER_H = 16;
const PLAYER_Y = H - 34;
const PLAYER_SPEED = 4.4;

const BULLET_SPEED = 6.5;
const FIRE_COOLDOWN = 260; // ms

const GREEN = "94, 234, 212"; // --accent
const BLUE = "125, 211, 252"; // --sky
const ORANGE = "255, 138, 61"; // neon orange, local to this feature

type Bug = { label: string; baseX: number; alive: boolean };
type Bullet = { x: number; y: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };
type Status = "playing" | "win" | "lose";

function freshBugs(): Bug[] {
  const total = LABELS.length * BUG_W + (LABELS.length - 1) * BUG_GAP;
  const startX = (W - total) / 2;
  return LABELS.map((label, i) => ({
    label,
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

  const playerXRef = useRef((W - PLAYER_W) / 2);
  const keysRef = useRef({ left: false, right: false });
  const draggingRef = useRef(false);
  const lastFireRef = useRef(0);
  const bulletsRef = useRef<Bullet[]>([]);
  const bugsRef = useRef<Bug[]>(freshBugs());
  const formationRef = useRef({ x: 0, y: 0, dir: 1 });
  const particlesRef = useRef<Particle[]>([]);
  const statusRef = useRef<Status>("playing");
  const starsRef = useRef<{ x: number; y: number; r: number }[]>([]);

  const [status, setStatus] = useState<Status>("playing");
  const [bugsAlive, setBugsAlive] = useState(LABELS.length);

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
    bugsRef.current = freshBugs();
    formationRef.current = { x: 0, y: 0, dir: 1 };
    particlesRef.current = [];
    statusRef.current = "playing";
    setStatus("playing");
    setBugsAlive(LABELS.length);
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

    starsRef.current = Array.from({ length: 34 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() > 0.8 ? 1.4 : 0.8,
    }));

    const step = () => {
      rafRef.current = requestAnimationFrame(step);

      // ---- update ----
      if (statusRef.current === "playing") {
        if (keysRef.current.left) playerXRef.current -= PLAYER_SPEED;
        if (keysRef.current.right) playerXRef.current += PLAYER_SPEED;
        playerXRef.current = Math.max(4, Math.min(W - PLAYER_W - 4, playerXRef.current));

        const bugs = bugsRef.current;
        const alive = bugs.filter((b) => b.alive);
        const formation = formationRef.current;
        const speed = 0.55 + (LABELS.length - alive.length) * 0.22;
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
              setBugsAlive((n) => {
                const next = n - 1;
                if (next <= 0) {
                  statusRef.current = "win";
                  setStatus("win");
                }
                return next;
              });
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
      ctx.font = "9px 'JetBrains Mono', ui-monospace, monospace";
      ctx.textAlign = "center";
      for (const bug of bugsRef.current) {
        if (!bug.alive) continue;
        const bx = bug.baseX + formation.x;
        const by = BUG_TOP + formation.y;
        drawBug(ctx, bx, by);
        ctx.fillStyle = `rgba(${ORANGE}, 0.85)`;
        ctx.fillText(bug.label, bx + BUG_W / 2, by - 9);
      }

      if (statusRef.current !== "lose") drawShip(ctx, playerXRef.current, PLAYER_Y);

      ctx.fillStyle = `rgb(${BLUE})`;
      for (const b of bulletsRef.current) ctx.fillRect(b.x, b.y, 2, 9);

      for (const p of particlesRef.current) {
        ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, p.life)})`;
        ctx.fillRect(p.x, p.y, 3, 3);
      }
    };

    const toLocalX = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return playerXRef.current;
      const scale = W / rect.width;
      return (clientX - rect.left) * scale - PLAYER_W / 2;
    };

    const onKeyDown = (e: KeyboardEvent) => {
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

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return (
    <div className="invaders" ref={wrapRef}>
      <div className="invaders-hud">
        <span>BUGS LEFT: {bugsAlive}/{LABELS.length}</span>
        <span className="invaders-hint">← → / A D · SPACE or CLICK to fire</span>
      </div>
      <div className="invaders-screen">
        <canvas ref={canvasRef} />
        {status === "win" && (
          <div className="invaders-overlay invaders-win">
            <p>DEPLOYS SUCCESSFUL!</p>
            <p className="invaders-sub">100% SLO COMPLIANT</p>
            <button type="button" className="btn btn-solid" onClick={reset}>
              Deploy again
            </button>
          </div>
        )}
        {status === "lose" && (
          <div className="invaders-overlay invaders-lose">
            <p>INCIDENT DETECTED!</p>
            <p className="invaders-sub">PagerDuty alert triggered</p>
            <button type="button" className="btn btn-solid" onClick={reset}>
              Trigger rollback
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
