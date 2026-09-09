import { projects } from "@/data/content";
import DiagramFigure from "./DiagramFigure";
import { ArrowIcon, ExternalIcon, GitHubIcon } from "./Icons";

export default function Projects() {
  return (
    <section id="projects" tabIndex={-1}>
      <div className="wrap">
        <h2 className="sec-head reveal">
          <span className="num">03.</span> Things I&rsquo;ve built <span className="rule" />
        </h2>

        <div className="projects">
          {projects.map((p) => (
            <article className="proj reveal" key={p.title}>
              <div className="proj-body">
                <p className="proj-kicker">Featured project</p>
                <h3>{p.title}</h3>
                <p className="tagline">{p.tagline}</p>
                <p className="problem">{p.problem}</p>
                <ul>
                  {p.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                <div className="chips">
                  {p.stack.map((s) => (
                    <span className="chip chip-muted" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
                {p.repo && (
                  <div className="proj-links">
                    <a className="btn btn-ghost" href={p.repo} target="_blank" rel="noreferrer">
                      <GitHubIcon size={16} /> Source <ExternalIcon size={14} />
                    </a>
                  </div>
                )}
              </div>
              <DiagramFigure kind={p.diagram} label={p.title} />
            </article>
          ))}

          <div className="repo-cta reveal">
            <div>
              <h3>More on GitHub</h3>
              <p>Terraform modules, pipeline experiments, Kubernetes manifests and scripts I keep sharpening.</p>
            </div>
            <a className="btn" href="https://github.com/mohasinmudassar?tab=repositories" target="_blank" rel="noreferrer">
              <GitHubIcon size={16} /> Browse repositories <ArrowIcon size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
