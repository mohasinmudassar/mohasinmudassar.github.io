"use client";

import { useState } from "react";
import Modal from "./Modal";
import DevOpsInvaders from "./DevOpsInvaders";
import { CloseIcon, GameIcon } from "./Icons";

export default function GameLauncher({ className, label }: { className?: string; label?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className ?? "game-toggle"}
        onClick={(event) => { event.currentTarget.focus({ preventScroll: true }); setOpen(true); }}
        aria-label="Play a game — DevOps Invaders"
        title="Play DevOps Invaders"
      >
        <GameIcon size={18} />
        {label}
      </button>

      {open && (
        <Modal label="DevOps Invaders" className="diagram-modal invaders-modal" initialFocus="canvas" onClose={() => setOpen(false)}>
          <div className="diagram-modal-card invaders-card">
            <button type="button" className="diagram-modal-close" onClick={() => setOpen(false)} aria-label="Close">
              <CloseIcon size={18} />
            </button>
            <h3 className="invaders-title">DevOps Invaders</h3>
            <DevOpsInvaders />
          </div>
        </Modal>
      )}
    </>
  );
}
