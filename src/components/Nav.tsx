import { nav, site } from "@/data/content";
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon, PhoneIcon } from "./Icons";
import GameLauncher from "./GameLauncher";
import MobileMenu from "./MobileMenu";

export default function Nav() {
  return (
    <>
      <header className="nav" id="nav">
        <div className="wrap">
          <a className="logo" href="#top" aria-label="Home">
            <span className="mark">MM</span>
            <span>{site.name}</span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            {nav.map((n) => (
              <a key={n.href} href={n.href} data-navlink={n.href}>
                <span className="n">{n.num}.</span>
                {n.label}
              </a>
            ))}
            <GameLauncher className="game-toggle" />
            <a className="btn btn-resume" href={site.resume} download style={{ marginLeft: 10 }}>
              <DownloadIcon /> Résumé
            </a>
          </nav>

          <MobileMenu />
        </div>
      </header>

      <nav className="rail rail-left" aria-label="Social links">
        <a href={`tel:${site.phone.replace(/\s/g, "")}`} aria-label={`Call ${site.phone}`}><PhoneIcon size={19} /></a>
        <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon size={19} /></a>
        <a href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon size={18} /></a>
        <a href={`mailto:${site.email}`} aria-label="Email"><MailIcon size={19} /></a>
      </nav>

      <nav className="rail rail-right" aria-label="Email contact">
        <a className="mail" href={`mailto:${site.email}`}>{site.email}</a>
      </nav>
    </>
  );
}
