# Deploying

The site is a **static export**: `npm run build` writes plain HTML/CSS/JS into
`out/`. It's deployed on **GitHub Pages**, live at
**<https://mohasinmudassar.github.io/>** — that's the one URL used on the CV,
LinkedIn and GitHub profile. Keep it that way rather than running the same
site on a second host: two indexed copies of identical content split search
ranking.

---

## GitHub Pages (how it's actually deployed)

The workflow is already committed at
`.github/workflows/deploy-github-pages.yml`.

1. The repo is **`mohasinmudassar/mohasinmudassar.github.io`** (that exact
   name is what makes it serve at the root domain).
2. Repo → *Settings* → *Pages* → **Build and deployment → Source: GitHub Actions**.
3. Push to `main`. The Action lints, builds, runs the Playwright regression
   suite, and publishes.
4. Live at `https://mohasinmudassar.github.io`.

Notes:

- `public/.nojekyll` is already there — GitHub Pages would otherwise ignore
  the `_next` folder and you'd get an unstyled page.
- Google Search Console is verified via `public/googlef93083ddd91c0433.html`
  — a static export serves everything in `public/` at the domain root, so
  that file resolves at `https://mohasinmudassar.github.io/googlef93083ddd91c0433.html`,
  exactly where Search Console's HTML-file method expects it. Don't move or
  rename it once it's verified.

---

## After deploying — a short checklist

- [ ] Open the site on your phone as well as a laptop.
- [ ] Click **Download résumé** and confirm the PDF opens.
- [ ] Update `site.url` in `src/data/content.ts` if the domain ever changes —
      it feeds the canonical URL, the sitemap and the Open Graph tags.
- [ ] Put the link in your LinkedIn *Contact info*, your GitHub profile bio,
      and the header of your CV.

## Keeping it current

The site is a static export, so "updating it" is just editing
`src/data/content.ts` and pushing. New job, new cert, new project — one file,
one commit, live in a couple of minutes.

## Other hosts

Vercel, Netlify and Cloudflare Pages can all serve this export too (build
command `npm run build`, publish directory `out`) if you ever want to move
off GitHub Pages — but don't run more than one live at once for the reason
above. If you previously had this on Netlify, delete that site so there's
only ever one indexed copy.
