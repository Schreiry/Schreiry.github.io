# portfolio.os — David Greve (Schreiry)

A **living CV interface** for David Greve (`Schreiry`): a glass-based, interactive,
single-page site that behaves like a small operating system rather than a resume
template. It fuses a CV, portfolio, technical identity, and visual taste into one
coherent, high-end experience.

**Plain HTML + CSS + JavaScript. No framework, no build step, no backend.**
It works two ways with zero setup:

- **Double-click `index.html`** → it just runs (scripts are classic, not ES modules).
- **Deploy to GitHub Pages** → live, with real-time GitHub stats.

---

## What's inside

- **Glassmorphism engine** — layered translucent panes, light sheen, cursor-reactive
  refraction, glass-on-glass, a moving specular highlight, and **hover shape-morph**
  (cards change form under the pointer).
- **Custom cursor** — a glowing dot + trailing ring that reacts to links and cards
  (falls back to the native cursor on touch / reduced-motion).
- **WebGL light field** (`shader.js`) — a domain-warped fbm shader painting slow color
  flow in the accent palette. Pauses when hidden, simplifies on weak devices, honors
  reduced-motion, and **falls back to a CSS aurora** if WebGL is unavailable.
- **Live GitHub panel** (`github.js`) — pulls real repo count, total stars, followers,
  following, a **language breakdown**, and **per-project star badges** from the GitHub
  API. Cached for 6h in `localStorage`; falls back to known numbers when offline /
  rate-limited.
- **Project screenshot gallery + lightbox** — the Exsul app ships with three screenshots;
  click any to open a keyboard-navigable lightbox.
- **Material You / Pixel "expressive" palette** — dark base + three close gradient tones
  (sky / orchid / mint) + one rare contrast (coral). Includes a **light "day-glass"
  theme** (dock toggle).
- **OS continuity** — top status/menu bar + floating glass **dock**; on phones the dock
  becomes a sticky bottom action bar.
- **UI construction details** — pixel/measurement overlays, section indices, terminal
  status strips, build-log microcopy — used sparingly.
- **Single source of truth** — every piece of personal data lives in
  [`src/config.js`](src/config.js).
- **Accessible** — semantic landmarks, keyboard focus, skip link, reduced-motion mode,
  readable contrast, no hover-only content, `noscript` fallback.

---

## File tree

```
.
├── index.html                 # semantic shell + data hooks
├── .nojekyll                  # tell GitHub Pages to serve files as-is
├── .gitignore                 # excludes the heavy original images
├── README.md
├── assets/
│   └── favicon.svg
├── cv/
│   └── David_Greve_CV.pdf      # placeholder — REPLACE with your real CV
├── images/
│   ├── portrait.jpg            # your photo (optimized ~87 KB)
│   ├── portrait.svg            # placeholder fallback (reference)
│   └── shots/                  # optimized app screenshots
│       ├── exsul-catalog.jpg
│       ├── exsul-orders.jpg
│       └── exsul-settings.jpg
├── src/
│   ├── config.js               # ← edit everything here (single source of truth)
│   ├── github.js               # live GitHub API stats (+ cache + fallback)
│   ├── shader.js               # WebGL light field (+ fallback)
│   ├── projects.js             # renders project "workstations" + gallery
│   ├── cursor.js               # custom glowing cursor
│   ├── interactions.js         # tilt, magnetic, copy/theme/lightbox, actions
│   ├── animations.js           # scroll reveal, language bars, scroll-spy, clock
│   └── main.js                 # orchestrator (runs last)
└── styles/
    ├── variables.css           # design tokens / palette / themes
    ├── base.css                # reset, typography, background field, a11y
    ├── layout.css              # structure, grids, OS chrome
    ├── glass.css               # glassmorphism engine + tilt + glass text
    ├── components.css          # buttons, portrait, skills, projects, dock, cursor…
    ├── animations.css          # keyframes + scroll-reveal classes
    └── responsive.css          # desktop → tablet → phone, print
```

> Scripts are loaded as ordered, classic `<script defer>` tags (see the bottom of
> `<head>` in `index.html`). That's deliberate: ES modules are blocked over `file://`,
> so classic scripts make the site work whether opened directly or served.

---

## Editing guide (everything in `src/config.js`)

Open [`src/config.js`](src/config.js) — it's grouped and commented. You don't need to
touch any other file for normal content changes.

### Personal data, links, email
`identity.*` (name, role, hero/about copy, photo, CV), `links.*` (github / linkedin /
email / socials). The contact email is public — change it freely.

### Replace the photo
Drop a file in `images/`, set `identity.photo` to its path, and update `identity.photoAlt`.
**Recommended:** ~`900 × 1100 px`, `< 200 KB`, subject centered. The glass frame
center-crops it.

### Replace the CV
Put your file at `cv/David_Greve_CV.pdf` (same name → no code change) or point
`identity.cv` somewhere else.

### Add / edit a project
Add an object to `projects`. Set `repoName` to the exact GitHub repo to get live stars,
and optionally `shots: [{ src, label }]` for a screenshot gallery:

```js
{
  id: "myproject", index: "07", title: "My Project",
  role: "What it is", language: "Rust", year: "2026", status: "active",
  accent: "primary",                       // primary | secondary | tertiary | expressive
  repo: "https://github.com/Schreiry/MyProject",
  repoName: "MyProject",                    // matches GitHub for live ★ count
  summary: "One clear sentence.",
  ideas: ["Idea one", "Idea two"],
  meta: [{ k: "lang", v: "rust" }],
  shots: [{ src: "./images/shots/my-1.jpg", label: "Main screen" }],
}
```

### Add a social link
Add a row to `social` (any with a `url` is shown), e.g. Telegram / Discord / X / website:

```js
{ id: "telegram", label: "Telegram", glyph: "TG", url: "https://t.me/yourname" },
```

### GitHub username / fallback numbers
`identity.githubUser` drives the live panel. `githubFallback` is shown when the API is
unreachable (e.g. opened via `file://`, where browsers may block the fetch).

---

## Run locally

- **Easiest:** double-click `index.html`. Everything works except the *live* GitHub
  fetch, which browsers often block on `file://` — the panel then shows the cached/
  fallback numbers. Everything else (content, gallery, stats layout, theme, cursor) works.
- **Full fidelity (live GitHub data):** serve it over HTTP:

```bash
python -m http.server 8000      # → http://localhost:8000
# or:  npx serve .
```

---

## Deploy to GitHub Pages

All paths are relative, so it works as a user site **or** a project site.
`git` is set up in this folder, but the final `push` needs *your* GitHub credentials.

### A — user site (recommended): `Schreiry.github.io`

1. Create a new GitHub repo named exactly **`Schreiry.github.io`** (public, empty).
2. From this folder run:

```bash
git remote add origin https://github.com/Schreiry/Schreiry.github.io.git
git branch -M main
git push -u origin main
```

3. On GitHub → **Settings → Pages → Build and deployment → Source: Deploy from a branch
   → `main` / `(root)`** → Save.
4. Live in ~1 minute at **https://schreiry.github.io/**.

### B — project site: e.g. `cv-website`

Same as above but with the repo name; the site lands at
`https://schreiry.github.io/cv-website/`. Relative paths resolve correctly under the
subpath — no changes needed.

> The included `.nojekyll` file ensures GitHub Pages serves everything verbatim.
> The first commit is authored as **David Greve** — no other contributors.
> If you want a different commit email, run
> `git commit --amend --author="David Greve <you@example.com>" --no-edit` before pushing.

---

## Performance & fallback behavior

- First paint isn't blocked by JS; if scripts fail, the static aurora field + all text
  remain.
- Shader: sub-resolution render, DPR-capped, octaves reduced on weak/touch devices,
  pauses on hidden tab, one frozen frame under reduced-motion, hides itself if WebGL is
  missing.
- GitHub API: 2 requests, cached 6h; graceful fallback to `githubFallback`.
- Pointer effects (cursor, tilt, magnetic, refraction) are rAF-throttled and disabled on
  touch / reduced-motion.
- Blur intensity drops at tablet/phone; one ambient blob on phones.
- Animations use only `transform` / `opacity`. `prefers-reduced-motion` neutralizes them.

### Recommended asset sizes

| Asset            | Target                   |
|------------------|--------------------------|
| Photo            | ~900 × 1100 px, < 200 KB |
| App screenshots  | ~1600 px wide, < 250 KB  |
| CV PDF           | < 2 MB                   |

---

## Accessibility

Semantic landmarks and heading order, skip link, visible keyboard focus, `aria-label`s on
icon controls, readable contrast (body text is never transparent), full reduced-motion
support, lightbox closes on Esc and traps to its controls, and a `noscript` notice.

---

## Credits

Personal portfolio of **David Greve (`Schreiry`)**. Fonts:
[Inter](https://rsms.me/inter/) and [JetBrains Mono](https://www.jetbrains.com/lp/mono/).
