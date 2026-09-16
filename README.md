# runthenumbers.ch

The personal site of Carmine Ragone — a data analyst in Zurich running the numbers
on training, budgets, and everything else. Astro, deployed to GitHub Pages from
`main` by `.github/workflows/deploy.yml`.

## Running it

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run preview
```

Node 22.12 or newer.

## Where things are

```text
src/
├── assets/fonts/     the three self-hosted variable fonts (see its README)
├── components/       nav, colophon, the project rows, the background canvas
├── content/
│   ├── projects/     the portfolio — one .md per project
│   └── writing/      the posts
├── data/figures.ts   the home page's figures, hand-entered
├── layouts/          Base (the shell), Article, Project
├── pages/            the routes
├── scripts/          the background route layer
└── styles/global.css the whole design system, one file
```

## Before changing how it looks

Read **`design.md`**. It is short, and it holds the rules that keep the design
coherent — what the two colours are for, why a figure never wraps, and why no
number on this site is ever invented.

## Adding a post or a project

Covered at the end of `design.md`. Both are a single Markdown file; the frontmatter
shape is enforced by `src/content.config.ts`.
