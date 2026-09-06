import { certifications, education, languages } from "@/data/content";
import { AwsBadgeIcon, ExternalIcon } from "./Icons";

export default function Credentials() {
  return (
    <section id="credentials">
      <div className="wrap">
        <h2 className="sec-head reveal">
          <span className="num">05.</span> Certifications &amp; education <span className="rule" />
        </h2>

        <div className="cred-grid">
          <div>
            {certifications.map((c) => (
              <div className="cert-card reveal" key={c.name} style={{ marginBottom: 20 }}>
                <span className="cert-badge">
                  <AwsBadgeIcon />
                </span>
                <div>
                  <h3>{c.name}</h3>
                  <p className="meta">
                    {c.issuer} · Earned {c.date}
                  </p>
                  <a href={c.url} target="_blank" rel="noreferrer">
                    About this certification <ExternalIcon size={12} />
                  </a>
                </div>
              </div>
            ))}

            <div className="lang-card reveal">
              <h3>Languages</h3>
              {languages.map((l) => (
                <div className="lang" key={l.name}>
                  <div className="row">
                    <b>{l.name}</b>
                    <span>{l.level}</span>
                  </div>
                  <div className="bar">
                    <i data-bar={l.pct} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {education.map((e) => (
              <div className="edu-item reveal" key={e.degree}>
                <h3>{e.degree}</h3>
                <div className="school">{e.school}</div>
                <p className="meta">
                  {e.period} · {e.location}
                </p>
                {e.note && <p className="note">{e.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
