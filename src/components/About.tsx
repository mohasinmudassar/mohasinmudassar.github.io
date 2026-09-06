import { about, site } from "@/data/content";

export default function About() {
  return (
    <section id="about">
      <div className="wrap">
        <h2 className="sec-head reveal">
          <span className="num">01.</span> About me <span className="rule" />
        </h2>

        <div className="about-grid">
          <div className="reveal">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="about-side">
            <div className="about-photo reveal">
              <img src="/headshot.jpg" alt={`${site.name} — ${site.role}`} loading="lazy" />
            </div>

            <div className="now-card reveal">
              <h3>Tech I reach for daily</h3>
              <div className="chips">
                {about.currently.map((c) => (
                  <span className="chip" key={c}>
                    {c}
                  </span>
                ))}
              </div>
              <p className="availability">
                <b>Open to work</b> — full-time Cloud / DevOps / Platform Engineering roles in Germany,
                English-speaking teams welcome. Reach me at{" "}
                <a href={`mailto:${site.email}`} style={{ color: "var(--accent)" }}>
                  {site.email}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
