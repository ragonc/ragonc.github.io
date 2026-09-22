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

**Who he is, then what he built.** The home page introduces him in one centred
paragraph and goes straight to the work. Everything is small, measured and quiet
except the name.

## The home page carries no figures *(decided 16.09.2026)*

This reverses what this file said all day, so it is written down plainly: **the
site called Run the Numbers shows none on its home page.**

The page opened with three real figures out of `data/data.db` — kilometres run,
hours trained, kilograms lifted — plus a three-column strip of secondary numbers
and a source line dating them. Seven arrangements of that hero were built and
rejected. Carmine's call was to stop arranging it and remove it: the figures, the
strip, the source line, and the "The things I built" chip, which pointed at a
section that now sits directly under the masthead.

**The chip came back the same day.** Removing it was this run's reasoning, not
his instruction, and he overruled it: it sits under the masthead paragraph,
centred, still pointing at `#built`. The anchor still earns its place on a phone,
where Built is below the fold. The rest of the removal stands.

What stays:

- **`src/data/figures.ts` is still on disk, and nothing reads it.** The
  `data/data.db` → JSON export is still the plan, and that file is where it lands.
  Do not delete it on the grounds that it is unused.
- **The figures inside the project rows** — sets in, 3 write-ups, 327
  activities on file — are part of the rows, not the stat display that went. They
  are still real. Since 22.09.2026 the GymLog sets are read from
  `gymlog.runthenumbers.ch/stats.json` at build time (`src/data/live.ts`), and the
  deploy runs every morning to keep them fresh; a figure marked `live:` in its
  content file falls back to the value typed beside it when GymLog cannot be
  reached. The write-ups are counted from the writing collection at build time
  (`live: 'writing'`). The 327 activities are still typed in and carry their own
  date in the label, because the colophon's date follows the GymLog read.
- **Rule 6 below still holds.** Nothing on this site is invented. Removing the
  figures does not license inventing anything to replace them.

If the figures come back, they come back as a decision, not as a regression: this
section is the record that their absence is deliberate.

## The first screen is the hero alone *(16.09.2026)*

**Nothing below the masthead is visible until someone scrolls or clicks the
chip.** `.masthead` is `min-height: calc(100svh - var(--nav-h))`, a flex column
centred on its cross axis, so it fills exactly the screen below the nav. This is
a macrostructure decision, not spacing: the home page is a landing page whose
first screen argues one thing, and the work arrives on a deliberate move.

- `--nav-h` is **63px**, measured at 320, 390, 768, 1024, 1440 and 1920px — the
  nav renders the same height at all of them. Re-measure it if the nav's
  padding, font-size or border changes.
- **`svh`, not `vh`.** On mobile browsers `100vh` measures against the viewport
  with the URL bar retracted, so the hero would be taller than the screen and
  Built would peek in anyway — the exact bug this rule fixes. A `vh` line sits
  above the `svh` one purely as a fallback.
- **`min-height`, not `height`.** A landscape phone (844×390) has less room than
  the hero's own content; min-height lets it grow instead of clipping. There you
  scroll to reach the chip, and Built is still below the fold. That case is not
  worth distorting the design for.
- **The chip is the only cue that there is more below.** Its arrow points right,
  not down. Left as it is — the label is Carmine's and he has not asked to
  change it — but it is the first thing to revisit if anyone reports not knowing
  to scroll.

Verified on bounding boxes: Built's top edge sits below the fold at 1280×800,
1440×900, 1920×1080, 390×844, 375×812, 360×640, 768×1024 and 844×390.

## The hierarchy *(amended 16.09.2026)*

**The name is the largest type on the page, and the only display-scale thing in
the masthead.** `--text-display` is `clamp(2.75rem, 11.6vw, 7.25rem)` — 116px at
desktop. 152px read as too big and 88px as too small; this is the size that was
kept.

**The masthead is centred; everything below it is not.** The introduction is the
one symmetrical thing on the site, and the project rows, the reads and the
colophon are left-aligned and tabular underneath it. That contrast is the
composition — the centring is not `text-align: center` painted onto a
left-aligned layout, and the rows are never centred: a row with a name left and a
figure right stops working the moment it is.

**The paragraph's measure is derived from the name, not chosen.** Its max-width
is `max(38ch, calc(var(--text-display) * 7.08))`, so the two centred blocks share
both edges at every viewport: 822px at desktop, still two lines. Do not replace that calc with a number — it would be right at one width and
wrong at all the others.

Three things about it, so the next change does not undo them by accident:

- **7.08 is measured, not guessed.** It is the ink width of "RUN THE NUMBERS" per
  px of font-size, in Sofia Sans Condensed 700 at 0.02em (23.09.2026; it was 6.18
  in Big Shoulders Display). Rename the site or change the face and it has to be
  measured again: render the h1, take its line-box width, divide by the computed
  font-size.
- **The 38ch floor is load-bearing.** Below ~600px the name is narrower than any
  readable measure — 27ch at 390px — so matching it there would set the paragraph
  as a column of scraps. The floor hands the width back to the page container.
- **The paragraph is two lines, and that is a copy constraint.** *(16.09.2026)*
  At the name's width the measure is ~65ch, so two lines is a budget of about
  130 characters. The sentence was 191 and set to three lines with a 34% last
  line, so it was cut to fit: "then build the tools that do the measuring for
  me" became "and build the tools that do it", and "This is what came out."
  went — Built sits directly underneath now, so the pointer had nothing left to
  do. It renders two lines at 93–96% fullness from 900px up. **Rewriting this
  sentence changes the line count**; re-check it at 900px and above before
  committing a new one. Below 900px it runs three or four lines: two is not
  achievable at every width, only where the name is wide enough to carry it.
- **The paragraph is 1.25rem because of the wrap, not the taste.** Matching the
  name's width and avoiding a short last line pull against each other. At
  1.1875rem the last line was 16% of the longest; 1.25rem makes it 34% at desktop
  and 99–100% at 600 and 768px. `text-wrap: pretty` is on and computes, but
  Chromium leaves a three-word last line alone; `text-wrap: balance` fixes it by
  setting the lines to 513px inside a 717px box, which un-matches the width. So
  balance is applied only below 600px, where the width is floored and carries no
  meaning. Re-run the sweep if the sentence is ever rewritten.

## Macrostructure

**Portfolio in front, writing behind.** The `blog` collection was empty and the
only writing was three tool posts, so the home page carries projects, not posts.

```
/              home — masthead, Built, Written
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
| Masthead | `.masthead` | home only — name and one paragraph, centred |
| Section head | `.head`, `.head-note` | home |
| Chip | `.chip` | home (under the masthead paragraph) and project pages |
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
7. **A figure never wraps.** `1,0` over `27` reads as a bug, not a number. Still
   true of the figures in the project rows.
7b. **The name never sets below `line-height: 1.02`.** It is all-caps, so it has
   no descenders: below 1.0 the cap-tops of a wrapped second line collide with
   the first. It does wrap, at 320px, so this is not hypothetical.
8. **No stat counter animation.** A figure caught mid-count reads as broken, and
   the number is the point.
9. **The words are Carmine's.** No filler copy, no invented testimonials, and no
   summary written to fill a page — a project with nothing to say yet has no page
   (`page: false` in its frontmatter), not a page of filler.
10. **In a chart, lime is the highlight** *(22.09.2026)*. Charts are the one place
   lime marks data rather than links: the thresholds and the zones that matter.
   Everything else in a chart is ink or muted, and a chart holds no link.

## Type

Four faces, self-hosted from `src/assets/fonts` — never loaded from Google at
runtime, because the colophon promises no tracking. See that folder's `README.md`
before touching a weight range.

- **Sofia Sans Condensed** (`--font-display`) — the name, headings, figures.
- **Newsreader** (`--font-body`) — running text.
- **Sofia Sans** (`--font-label`) — labels, the nav, meta lines, dates, the
  colophon, and every word inside a chart.
- **JetBrains Mono** (`--font-mono`) — code, and nothing else.

**Only the name is in capitals.** *(23.09.2026)* "RUN THE NUMBERS", in the
masthead and the nav wordmark, is set in capitals whatever the face — Carmine's
call. Headings, labels and the nav are sentence case with near-zero tracking.

**Why Big Shoulders went.** *(23.09.2026)* After the first running post Carmine
found the type childish: Big Shoulders Display in capitals on every heading, and
JetBrains Mono in spaced capitals on every label, were three loud voices at once.
Sofia Sans Condensed keeps the condensed, scoreboard figures without the
sports-jersey look; Sofia Sans at normal width carries the small text, so labels
and charts share one family with the headings. Direction 10 of the comparison in
the argo-os repo (`projects/runthenumbers/docs/designs/2026-09-22-type-directions.html`),
chosen by Carmine after comparing it with Archivo, the GymLog face, which
wraps the name onto two lines on a phone.

Numbers that sit in a column get `.tnum` for tabular figures; chart text is
tabular by default.

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

`src/data/figures.ts` holds three figures and a three-item strip, hand-entered
from `data/data.db`. **Nothing renders them since 16.09.2026** — see the section
above. The file and `LAST_MEASURED` in `src/consts.ts` are kept for the export job
that will replace the file's contents.

For the record, so the numbers are not lost: the kilograms figure is **10,913 kg**
from `lf_strength_log` across 51 sets. `strength_sets` disagrees at 7,112 kg for
the same span; `lf_strength_log` is the sheet Carmine actually fills in, so it was
the published one. The log starts 20.08.2026, which is why its label carried
"since Aug 2026" — without that the figure claims to be all-time, which would
break rule 6.

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

**A chart in a post** *(22.09.2026)* — the post becomes `.mdx` and uses
`src/components/Chart.astro`, which inlines the SVG. Never an `<img>`: an image
cannot load the site's fonts, so it falls back to system faces and the page ends up
with six. The SVGs live in `src/assets/charts/`, in two drawings: a wide one and a
narrow one about 343 units across for phones, so labels render at 12px. Inside them,
fonts and colours come from `var(--font-*)` and `var(--color-*)`, and every style
rule is scoped to the SVG's own `id`, so two charts on one page never override
each other. No background rect and no title in the drawing: the title and a
one-line caption go in the figcaption, which keeps the h2 the loudest thing in the
section. A chart that shows a typical shape rather than measured data says so in
its caption (rule 6).

**A new component** — first check whether `.row`, `.reads` or `.spec` already does
it. The system is deliberately small.

## Checked

**2026-09-16, after the figures were removed.** All six page types — home, both
index pages, a project page, an article and about — render at 320, 360, 375, 390,
414, 540, 600, 768, 900, 1024, 1280, 1440 and 1920px with no horizontal overflow,
no console errors, no failed requests, one `h1` each, and no clickable text
wrapping to two lines. The all-caps name never sets below `line-height: 1.02`. At
1280×800 the masthead ends at 434px and the first project row is fully visible at
741px, so the introduction and the first thing he built share the fold. The
paragraph matches the name's width exactly from 600px up, never exceeds 65ch, and
sets to two lines from 900px up. One width, 600px exactly, keeps a short last
line in a four-line block: it sits just above the breakpoint where `text-wrap:
balance` takes over, and balancing it there would un-match the width.

**Known, not caused by this change:** `/writing/batch-work/` renders two `<h1>`
elements — the layout's title and an `# Batch work` heading inside the post's
markdown body. The fix belongs in the post, not the design system.
