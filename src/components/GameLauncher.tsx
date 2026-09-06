"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import DevOpsInvaders from "./DevOpsInvaders";
import { CloseIcon, GameIcon } from "./Icons";

export default function GameLauncher({ className, label }: { className?: string; label?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={className ?? "game-toggle"}
        onClick={() => setOpen(true)}
        aria-label="Play a game — DevOps Invaders"
        title="Play DevOps Invaders"
      >
        <GameIcon size={18} />
        {label}
      </button>

      {open &&
        createPortal(
          <div className="diagram-modal" role="dialog" aria-modal="true" aria-label="DevOps Invaders" onClick={() => setOpen(false)}>
            <div className="diagram-modal-card invaders-card" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="diagram-modal-close" onClick={() => setOpen(false)} aria-label="Close">
                <CloseIcon size={18} />
              </button>
              <h3 className="invaders-title">DevOps Invaders</h3>
              <DevOpsInvaders />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
