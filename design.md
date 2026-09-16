# design.md — runthenumbers.ch

The design system this site is built on, so the next change does not have to
re-derive it. The full record of *why* each decision was taken — question by
question, in Carmine's words — is the design brief in the `argo-os` repo at
`outputs/2026-09-16-runthenumbers-design-brief.md`. This file is the short version:
what the system is, and the rules that keep it coherent.

Approved as a mockup on 2026-09-16 and ported here the same day. The mockup lives
at `outputs/designs/runthenumbers-site/` in `argo-os`; where this repo and that
folder disagree, **this repo wins** — the mockup is a record, not a dependency.

---

## The one-line brief

A **scoreboard on a night map**: the figures are the loudest thing on the page,
everything else is small, measured and quiet.

The site is called Run the Numbers. Before this redesign it showed none. The home
page now opens with real figures out of `data/data.db`, not a sentence about
measuring things.

## Macrostructure

**Portfolio in front, writing behind.** The `blog` collection was empty and the
only writing was three tool posts, so the home page carries projects, not posts.

```
/              home — masthead, figures, strip, Built, Written
/projects/     the portfolio index
/projects/…/   one project
/writing/      the writing index
/writing/…/    one article
/about/        about
```

`/argo-tools/*` and `/blog` redirect into `/writing/` (see `astro.config.mjs`).
Those URLs are out in the world; they stay working.

## The parts

| Part | Class | Where |
| --- | --- | --- |
| Nav, edge-aligned minimal | `.n9` | every page; `.is-home` drops the wordmark |
| Masthead | `.masthead` | home only |
| Stat-led hero | `.stat-hero`, `.figures`, `.figure` | home |
| Supporting strip | `.strip` | home |
| Section head | `.head`, `.head-note` | home |
| Project rows | `.rows`, `.row` | home, `/projects/` |
| Writing list | `.reads`, `.reads.is-index` | home, `/writing/` |
| Project page | `.proj-head`, `.spec`, `.steps` | `/projects/…/` |
| Article page | `.article`, `.pull` | `/writing/…/` |
| Dense colophon | `.ft4` | every page |

All of it is in `src/styles/global.css`, tokens first. There is no second
stylesheet and no component-scoped CSS: one file, one system.

## The rules

1. **Two voices, never one.** Near-white carries the figures; lime marks links and
   live state. A single colour on black is what made the first attempt read as
   blank. Never set a figure in lime, and never use near-white for a link.
2. **Lime is the family colour**, shared with GymLog, so the site and the app look
   related. Not Strava orange — the page would read as Strava's.
3. **Dark only.** There is no light mode to fall back to; `color-scheme` is `dark`
   and `body` sets its own background.
4. **Hairlines, not boxes.** Emptiness is not fixed by drawing frames around
   things. Rows and lists are separated by 1px rules, never cards.
5. **Tight.** "Too much space" was half of what was wrong before. The spacing scale
   runs closer than the Astro starter's; more fits on one screen.
6. **No invented numbers, ever.** Every figure on the site is real and dated. A
   figure that is not countable yet shows a dash and says why — see the kilograms
   row. This is the site's whole premise and it is not negotiable.
7. **A figure never wraps.** `1,0` over `27` reads as a bug, not a number.
8. **No stat counter animation.** A figure caught mid-count reads as broken, and
   the number is the point.
9. **The words are Carmine's.** No filler copy, no invented testimonials, and no
   summary written to fill a page — a project with nothing to say yet has no page
   (`page: false` in its frontmatter), not a page of filler.

## Type

Three faces, self-hosted from `src/assets/fonts` — never loaded from Google at
runtime, because the colophon promises no tracking. See that folder's `README.md`
before touching a weight range.

- **Big Shoulders Display** (`--font-display`) — figures, headings, the wordmark.
  Condensed, uppercase, tight tracking.
- **Newsreader** (`--font-body`) — running text.
- **JetBrains Mono** (`--font-mono`) — labels, meta lines, dates, the colophon.

Numbers that sit in a column get `.tnum` for tabular figures.

## The background

`src/components/RouteMap.astro` draws a faint street network on a `<canvas>`,
fixed behind every page, `aria-hidden`, drawn from a fixed seed so it is identical
on every load and every device. It is **decorative and explicitly not real GPS
data**.

It is a stand-in. The real thing is a Strava-style heatmap of Zurich built from
Carmine's own Garmin activities (327 of them in `data/data.db`) — the streets he
runs most, brightest. When that lands, replace the drawing in
`src/scripts/routemap.js` and nothing else moves. The `--map-*` tokens in
`global.css` are the layer's whole palette; it improvises no colour of its own.

## The figures

`src/data/figures.ts`, hand-entered, with `LAST_MEASURED` in `src/consts.ts` as
the date they were read. The colophon and the source line under the strip both
read that constant, so they cannot disagree.

Wiring them to update themselves — a `data/data.db` → JSON export the build reads
— is a separate job. When it lands it replaces the contents of `figures.ts` and
nothing else.

**Settled 2026-09-16:** the kilograms figure was a dash while Carmine decided. It
now publishes **10,913 kg**, which is what `lf_strength_log` holds across 51 sets.
Two things to know before anyone edits it: `strength_sets` disagrees at 7,112 kg for
the same span — `lf_strength_log` is the sheet he actually fills in, so it is the one
published — and the log only starts 20.08.2026, which is why the period sits in the
label. Take "since Aug 2026" out and the figure claims to be all-time, which breaks
rule 6.

## Adding things

**A post** — a `.md` file in `src/content/writing/` with `title`, `description`,
`pubDate`, optionally `byline`. The description is the standfirst on the article
page and the line under the title on the index, so write it as a sentence, not a
label. `byline` is where a post says a draft came from the setup, which the About
page promises it will.

**A project** — a `.md` file in `src/content/projects/`. `state` and `meta` build
the row; `figure` is the number on the right and must be real or left out;
`order` sorts. Set `page: false` when there is nothing to say on a page of its own
— give it an `href` and the row links there, leave `href` out and the row is plain
text. The full shape is in `src/content.config.ts`.

**A new component** — first check whether `.row`, `.reads` or `.spec` already does
it. The system is deliberately small.

## Checked

Every page renders at 390px and 1440px with no horizontal overflow, no console
errors and no failed requests; computed type scale, colour and page width match
the approved mockup exactly on home, project, article and about.
