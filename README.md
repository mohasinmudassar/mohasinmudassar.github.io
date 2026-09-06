# mohasinmudassar.dev — personal site

Personal site for **Mohasin Mudassar**, Cloud & DevOps Engineer (Bamberg, Germany).

Next.js 16 (App Router) → **static HTML export**. No database, no server, no paid
services. It deploys for €0 on Vercel, GitHub Pages, Netlify or Cloudflare Pages.

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
- `src/lib/behaviors.ts` — all client-side behaviour (typewriter, tabs, scroll
  reveal, mobile menu) as one plain-JS script. No React state, so the exported
  HTML works instantly, before any hydration.
- `public/Mohasin-Mudassar-Resume.pdf` — replace this file to update the
  "Download résumé" button. Keep the filename.
- `src/app/layout.tsx` — page title, meta description, Open Graph tags and the
  JSON-LD structured data that Google reads.

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

See **[DEPLOY.md](./DEPLOY.md)** — three free options, step by step.
