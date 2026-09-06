import { jobs } from "@/data/content";

export default function Experience() {
  return (
    <section id="experience">
      <div className="wrap">
        <h2 className="sec-head reveal">
          <span className="num">02.</span> Where I&rsquo;ve worked <span className="rule" />
        </h2>

        <div className="exp reveal" id="exp">
          <div className="exp-tabs" role="tablist" aria-label="Companies">
            <span className="exp-marker" id="expMarker" />
            {jobs.map((j, i) => (
              <button
                key={j.id}
                className="exp-tab"
                role="tab"
                id={`tab-${j.id}`}
                aria-controls={`panel-${j.id}`}
                aria-selected={i === 0}
                tabIndex={i === 0 ? 0 : -1}
                data-tab={j.id}
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
                hidden={i !== 0}
                data-panel={j.id}
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
