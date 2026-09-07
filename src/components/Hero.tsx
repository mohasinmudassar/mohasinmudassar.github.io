import { site, stats, typewriter } from "@/data/content";
import { ArrowIcon, DownloadIcon } from "./Icons";
import AsciiPortrait from "./AsciiPortrait";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="kicker reveal" suppressHydrationWarning>
              <span className="dot" />
              Available for Cloud / DevOps roles in Germany
            </p>

            <h1 className="reveal" suppressHydrationWarning>Mohasin Mudassar.</h1>
            <h2 className="reveal" suppressHydrationWarning>
              I build things that run in production.
              <span className="type-line">
                <span className="tw" id="tw" data-words={JSON.stringify(typewriter)}>
                  {typewriter[0]}
                </span>
                <span className="caret" />
              </span>
            </h2>

            <p className="lede reveal" suppressHydrationWarning>{site.tagline}</p>

            <div className="hero-cta reveal" suppressHydrationWarning>
              <a className="btn btn-solid" href="#projects">
                See my work <ArrowIcon />
              </a>
              <a className="btn btn-ghost" href={site.resume} download>
                <DownloadIcon /> Download résumé
              </a>
            </div>

            <p className="hero-meta reveal" suppressHydrationWarning>
              <span>📍 {site.location}</span>
              <span>AWS Certified Solutions Architect – Associate</span>
              <span>English C1 · German A2</span>
            </p>
          </div>

          <div className="reveal" suppressHydrationWarning>
            <AsciiPortrait src="/hero.jpeg" alt={`${site.name} — ${site.role}`} />
          </div>
        </div>

        <div className="stats reveal" suppressHydrationWarning>
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
