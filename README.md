# mohasinmudassar.github.io — personal site

Personal site for **Mohasin Mudassar**, Cloud & DevOps Engineer (Germany).

Next.js 16 (App Router) → **static HTML export**, deployed on GitHub Pages at
**<https://mohasinmudassar.github.io/>** — the one URL used on the CV, LinkedIn
and GitHub profile. No database, no server, no paid services.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site lands in ./out
```

## Where to edit things

Almost everything you'll want to change lives in **one file**:

```
src/data/content.ts
```

| I want to change… | Edit |
| --- | --- |
| Name, email, phone, social links, résumé path | `site` |
| The rotating line under the headline | `typewriter` |
| The four headline numbers | `stats` |
| Bio paragraphs and the "tech I reach for" chips | `about` |
| Jobs, dates, bullet points, per-job tech chips | `jobs` |
| Featured projects (incl. which diagram they use) | `projects` |
| Skill categories and their items | `skills` |
| Certifications, education, languages | `certifications`, `education`, `languages` |
| Nav labels and section numbering | `nav` |

Other files, if you need them:

- `src/app/globals.css` — the whole design. Colours are CSS variables at the top
  (`--accent` is the mint; change that one value to re-theme the site).
- `src/components/Diagrams.tsx` — the two hand-drawn architecture SVGs.
  Add a new one and reference it from a project's `diagram` field.
- `src/lib/behaviors.ts` — scroll reveals, language bars and navigation effects,
  initialized after hydration by `SiteEffects.tsx`, with listener cleanup.
- `src/components/Typewriter.tsx`, `MobileMenu.tsx`, `Modal.tsx` — the headline
  animation and accessible dialogs. The initial HTML stays readable while JavaScript loads.
- `public/Mohasin-Mudassar-Resume.pdf` — replace this file to update the
  "Download résumé" button. Keep the filename.
- `src/app/layout.tsx` — page title, meta description, Open Graph tags and the
  JSON-LD structured data that Google reads.
- `src/app/opengraph-image.png` — the 1200×630 picture LinkedIn/WhatsApp/Slack
  show when the link is shared. Next.js wires it up automatically; replace the
  file to update it (headshot + name + role on the site's dark background).

## Adding a project

```ts
// src/data/content.ts → projects
{
  title: "Multi-account AWS landing zone",
  tagline: "Terraform · Control Tower · SCPs",
  problem: "One shared account meant no blast radius and no cost attribution.",
  bullets: ["…", "…"],
  stack: ["Terraform", "AWS Organizations"],
  repo: "https://github.com/mohasinmudassar/…",
  diagram: "gitops", // or add your own in Diagrams.tsx
}
```

## Deploying

Run `npm run lint` and `npm run test:e2e` to check changes. Install the browser
engines once with `npx playwright install chromium firefox webkit`. The E2E command
builds and tests the static export in all three engines. The GitHub Pages workflow
also runs lint and the Chromium regression suite before publishing.

See **[DEPLOY.md](./DEPLOY.md)** for the GitHub Pages setup, step by step.
