"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Diagram } from "./Diagrams";
import { CloseIcon, ExpandIcon } from "./Icons";

export default function DiagramFigure({ kind, label }: { kind: "gitops" | "costopt"; label: string }) {
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
      <figure className="proj-figure">
        <button type="button" className="proj-figure-btn" onClick={() => setOpen(true)}>
          <Diagram kind={kind} />
          <span className="proj-figure-hint">
            <ExpandIcon size={13} /> Click to enlarge
          </span>
        </button>
      </figure>

      {/* Portalled to <body> — the card it lives in gets a hover transform
          and overflow:hidden, either of which would clip a position:fixed
          child if it stayed nested here. `open` only ever flips true from a
          browser click, so document.body is never touched during SSR. */}
      {open &&
        createPortal(
          <div className="diagram-modal" role="dialog" aria-modal="true" aria-label={`${label} — architecture diagram`} onClick={() => setOpen(false)}>
            <div className="diagram-modal-card" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="diagram-modal-close" onClick={() => setOpen(false)} aria-label="Close">
                <CloseIcon size={18} />
              </button>
              <Diagram kind={kind} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
