import { site } from "@/data/content";
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon, WhatsAppIcon } from "./Icons";

export default function Contact() {
  return (
    <section className="contact" id="contact" tabIndex={-1}>
      <div className="wrap">
        <p className="num reveal">06. What&rsquo;s next</p>
        <h2 className="reveal">Get in touch</h2>
        <p className="reveal">
          I&rsquo;m looking for a full-time Platform Engineer or Site Reliability Engineer role in Germany and I read every message.
          Hiring, collaborating, or just want to talk Terraform — my inbox is open.
        </p>

        <div className="contact-actions reveal">
          <a className="btn btn-solid" href={`mailto:${site.email}`}>
            <MailIcon size={16} /> Say hello
          </a>
          <a className="btn btn-ghost" href={site.resume} download>
            <DownloadIcon /> Download résumé
          </a>
        </div>

        <div className="social-row reveal">
          <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon size={19} /></a>
          <a href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon size={18} /></a>
          <a href={site.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsAppIcon size={18} /></a>
          <a href={`mailto:${site.email}`} aria-label="Email"><MailIcon size={19} /></a>
        </div>
      </div>
    </section>
  );
}
