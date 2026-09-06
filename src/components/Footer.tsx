import { site } from "@/data/content";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./Icons";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-social">
          <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon size={18} /></a>
          <a href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon size={17} /></a>
          <a href={`mailto:${site.email}`} aria-label="Email"><MailIcon size={18} /></a>
        </div>
        <p style={{ margin: 0 }}>
          Designed &amp; built by {site.name} · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
