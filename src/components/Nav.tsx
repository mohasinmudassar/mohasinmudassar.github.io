import { nav, site } from "@/data/content";
import { DownloadIcon, MenuIcon, CloseIcon, GitHubIcon, LinkedInIcon, MailIcon } from "./Icons";
import GameLauncher from "./GameLauncher";

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

          <button className="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="drawer">
            <span data-icon="open"><MenuIcon /></span>
            <span data-icon="close" hidden><CloseIcon /></span>
          </button>
        </div>
      </header>

      <div className="scrim" id="scrim" />
      <aside className="drawer" id="drawer" aria-label="Mobile menu">
        {nav.map((n) => (
          <a key={n.href} href={n.href} data-drawer-link>
            <span className="n">{n.num}.</span>
            {n.label}
          </a>
        ))}
        <GameLauncher className="game-toggle game-toggle-drawer" label="Play a game" />
        <a className="btn" href={site.resume} download style={{ marginTop: 18, justifyContent: "center" }}>
          <DownloadIcon /> Download résumé
        </a>
      </aside>

      <div className="rail rail-left" aria-hidden="false">
        <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon size={19} /></a>
        <a href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon size={18} /></a>
        <a href={`mailto:${site.email}`} aria-label="Email"><MailIcon size={19} /></a>
      </div>

      <div className="rail rail-right">
        <a className="mail" href={`mailto:${site.email}`}>{site.email}</a>
      </div>
    </>
  );
}
