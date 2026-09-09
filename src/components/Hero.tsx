import { site, stats, typewriter } from "@/data/content";
import { ArrowIcon, MailIcon } from "./Icons";
import Typewriter from "./Typewriter";
import AsciiPortrait from "./AsciiPortrait";

export default function Hero() {
  return (
    <section className="hero" id="top" tabIndex={-1}>
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="kicker reveal" suppressHydrationWarning>
              <span className="dot" />
              Available for Platform Engineer / Site Reliability Engineer roles in Germany
            </p>

            <h1 className="reveal" suppressHydrationWarning>Mohasin Mudassar.</h1>
            <h2 className="reveal" suppressHydrationWarning>
              I build things that run in production.
              <Typewriter words={typewriter} />
            </h2>

            <p className="lede reveal" suppressHydrationWarning>{site.tagline}</p>

            <div className="hero-cta reveal" suppressHydrationWarning>
              <a className="btn btn-solid" href="#projects">
                See my work <ArrowIcon />
              </a>
              <a className="btn btn-ghost" href={`mailto:${site.email}`}>
                <MailIcon size={16} /> Say hi
              </a>
            </div>

            <p className="hero-meta reveal" suppressHydrationWarning>
              <span>📍 {site.location}</span>
              <span>AWS Certified Solutions Architect – Associate</span>
              <span>English Native · German A2</span>
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
