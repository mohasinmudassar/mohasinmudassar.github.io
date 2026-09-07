"use client";

import { useState } from "react";
import Modal from "./Modal";
import { Diagram } from "./Diagrams";
import { CloseIcon, ExpandIcon } from "./Icons";

export default function DiagramFigure({ kind, label }: { kind: "gitops" | "costopt"; label: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <figure className="proj-figure">
        <button type="button" className="proj-figure-btn" onClick={(event) => { event.currentTarget.focus({ preventScroll: true }); setOpen(true); }}>
          <Diagram kind={kind} />
          <span className="proj-figure-hint">
            <ExpandIcon size={13} /> Click to enlarge
          </span>
        </button>
      </figure>

      {open && (
        <Modal label={`${label} — architecture diagram`} onClose={() => setOpen(false)}>
          <div className="diagram-modal-card">
            <button type="button" className="diagram-modal-close" onClick={() => setOpen(false)} aria-label="Close">
              <CloseIcon size={18} />
            </button>
            <Diagram kind={kind} />
          </div>
        </Modal>
      )}
    </>
  );
}
