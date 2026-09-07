"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/data/content";
import { CloseIcon, DownloadIcon, MenuIcon } from "./Icons";
import GameLauncher from "./GameLauncher";
import Modal from "./Modal";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 821px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  const navigate = (href: string) => {
    setOpen(false);
    // Run after the dialog restores focus to its trigger on unmount.
    requestAnimationFrame(() => {
      const section = document.querySelector<HTMLElement>(href);
      section?.focus({ preventScroll: true });
    });
  };

  return (
    <>
      <button className="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded={open} aria-haspopup="dialog" onClick={(event) => { event.currentTarget.focus({ preventScroll: true }); setOpen(true); }}>
        <MenuIcon />
      </button>
      {open && (
        <Modal id="drawer" className="drawer-modal" label="Mobile menu" onClose={() => setOpen(false)}>
          <div className="drawer">
            <button className="drawer-close" aria-label="Close menu" onClick={() => setOpen(false)}><CloseIcon /></button>
            <nav className="drawer-links" aria-label="Mobile navigation">
              {nav.map((item) => (
                <a key={item.href} href={item.href} onClick={() => navigate(item.href)}>
                  <span className="n">{item.num}.</span>{item.label}
                </a>
              ))}
              <a href="#contact" onClick={() => navigate("#contact")}><span className="n">06.</span>Contact</a>
              <GameLauncher className="game-toggle game-toggle-drawer" label="Play a game" />
              <a className="btn" href={site.resume} download style={{ marginTop: 18, justifyContent: "center" }}><DownloadIcon /> Download résumé</a>
            </nav>
          </div>
        </Modal>
      )}
    </>
  );
}
