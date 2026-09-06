"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { jobs } from "@/data/content";

export default function Experience() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const markerRef = useRef<HTMLSpanElement | null>(null);

  // Marker position is derived from the active tab's real layout, so it can
  // never drift out of sync with what's actually rendered.
  useLayoutEffect(() => {
    const position = () => {
      const tab = tabRefs.current[active];
      const marker = markerRef.current;
      if (!tab || !marker) return;
      const mobile = window.matchMedia("(max-width: 820px)").matches;
      if (mobile) {
        marker.style.width = `${tab.offsetWidth}px`;
        marker.style.height = "2px";
        marker.style.transform = `translate(${tab.offsetLeft}px, 0)`;
      } else {
        marker.style.width = "2px";
        marker.style.height = `${tab.offsetHeight}px`;
        marker.style.transform = `translate(0, ${tab.offsetTop}px)`;
      }
    };
    position();
    window.addEventListener("resize", position);
    return () => window.removeEventListener("resize", position);
  }, [active]);

  const select = (i: number, focus = false) => {
    setActive(i);
    if (focus) requestAnimationFrame(() => tabRefs.current[i]?.focus());
  };

  return (
    <section id="experience">
      <div className="wrap">
        <h2 className="sec-head reveal">
          <span className="num">02.</span> Where I&rsquo;ve worked <span className="rule" />
        </h2>

        <div className="exp reveal">
          <div className="exp-tabs" role="tablist" aria-label="Companies">
            <span className="exp-marker" ref={markerRef} />
            {jobs.map((j, i) => (
              <button
                key={j.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                className="exp-tab"
                role="tab"
                id={`tab-${j.id}`}
                aria-controls={`panel-${j.id}`}
                aria-selected={i === active}
                tabIndex={i === active ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={(e) => {
                  let n = -1;
                  if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (i + 1) % jobs.length;
                  if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (i - 1 + jobs.length) % jobs.length;
                  if (n >= 0) {
                    e.preventDefault();
                    select(n, true);
                  }
                }}
              >
                {j.company}
              </button>
            ))}
          </div>

          <div className="exp-panels">
            {jobs.map((j, i) => (
              <div
                key={j.id}
                className="exp-panel"
                role="tabpanel"
                id={`panel-${j.id}`}
                aria-labelledby={`tab-${j.id}`}
                hidden={i !== active}
              >
                <h3>
                  {j.role} <span className="at">@ {j.company}</span>
                </h3>
                <p className="meta">
                  <span>{j.period}</span>
                  <span>{j.location}</span>
                </p>
                <ul>
                  {j.bullets.map((b, k) => (
                    <li key={k}>{b}</li>
                  ))}
                </ul>
                <div className="chips">
                  {j.stack.map((s) => (
                    <span className="chip chip-muted" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
