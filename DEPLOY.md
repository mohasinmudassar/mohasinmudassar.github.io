# Deploying — all free, pick one

The site is a **static export**: `npm run build` writes plain HTML/CSS/JS into
`out/`. Any static host serves it. Nothing here costs money and nothing needs a
credit card.

---

## Step 0 — put the code on GitHub (once)

```bash
cd portfolio
git init
git add -A
git commit -m "Personal site"
git branch -M main
git remote add origin https://github.com/mohasinmudassar/portfolio.git
git push -u origin main
```

Create the empty `portfolio` repo on GitHub first (no README, no .gitignore).

---

## Option A — Vercel (recommended, this is what you picked)

1. Go to **vercel.com** → *Sign up with GitHub*. The Hobby plan is free forever
   for personal projects; you never enter payment details.
2. *Add New…* → *Project* → import `mohasinmudassar/portfolio`.
3. Vercel detects Next.js on its own. **Change nothing.** Click *Deploy*.
4. Two minutes later you're live at `portfolio-<something>.vercel.app`.
5. Every `git push` to `main` redeploys automatically. Pull requests get their
   own preview URL.

**Nicer URL, still free:** Project → *Settings* → *Domains* → add
`mohasinmudassar.vercel.app` if it's free. A real domain like
`mohasinmudassar.dev` costs ~€10–15/year at Namecheap or Porkbun — Vercel
itself doesn't charge you to attach it. Skip it if you want to stay at zero.

---

## Option B — GitHub Pages (keeps your existing mohasinmudassar.github.io)

The workflow is already committed at
`.github/workflows/deploy-github-pages.yml`.

1. Push this project to the repo **`mohasinmudassar/mohasinmudassar.github.io`**
   (that exact name is what makes it serve at the root domain).
2. Repo → *Settings* → *Pages* → **Build and deployment → Source: GitHub Actions**.
3. Push to `main`. The Action builds and publishes.
4. Live at `https://mohasinmudassar.github.io`.

Notes:
- `public/.nojekyll` is already there — GitHub Pages would otherwise ignore the
  `_next` folder and you'd get an unstyled page.
- If you ever deploy to a **project** repo instead (e.g.
  `github.com/mohasinmudassar/portfolio` → `/portfolio/`), add
  `basePath: "/portfolio"` to `next.config.ts`. For the `.github.io` root repo,
  leave it alone.

**You can run A and B at the same time.** Vercel as the fast primary, GitHub
Pages at your existing `.github.io` address. Same repo, same commits.

---

## Option C — Netlify or Cloudflare Pages

Both free. Import the repo and use:

- Build command: `npm run build`
- Publish directory: `out`

---

## After deploying — a short checklist

- [ ] Open the site on your phone as well as a laptop.
- [ ] Click **Download résumé** and confirm the PDF opens.
- [ ] Update `site.url` in `src/data/content.ts` to the address you actually
      use. It feeds the canonical URL, the sitemap and the Open Graph tags.
- [ ] Put the link in your LinkedIn *Contact info*, your GitHub profile bio, and
      the header of your CV.
- [ ] Add an OG image later if you want link previews to show a picture:
      drop `opengraph-image.png` (1200×630) into `src/app/` and Next wires it up.

## Keeping it current

The site is a static export, so "updating it" is just editing
`src/data/content.ts` and pushing. New job, new cert, new project — one file,
one commit, live in two minutes.
