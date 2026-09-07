import { skills } from "@/data/content";
import { SkillIcon } from "./Icons";

export default function Skills() {
  return (
    <section id="skills" tabIndex={-1}>
      <div className="wrap">
        <h2 className="sec-head reveal">
          <span className="num">04.</span> What I work with <span className="rule" />
        </h2>

        <div className="skill-grid">
          {skills.map((s) => (
            <div className="skill-card reveal" key={s.title}>
              <span className="ico">
                <SkillIcon name={s.icon} />
              </span>
              <h3>{s.title}</h3>
              <ul>
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
