# Fonts

The four faces of the design system, self-hosted rather than loaded from
`fonts.googleapis.com`. Two reasons: the colophon says "no tracking", and a build
that fetches fonts over the network is a build that breaks when someone else's API
does.

Each file is the **latin subset of the variable font**, taken from Google Fonts on
2026-09-16 (the two Sofia Sans files on 2026-09-23). The weight range in `astro.config.mjs` must stay inside the range the
file actually carries, or the browser synthesises the weight and the condensed
display face stops looking condensed.

| File | Family | Axis range | Used for |
| --- | --- | --- | --- |
| `sofia-sans-condensed-latin.woff2` | Sofia Sans Condensed | `wght` 1–1000 (config uses 400–800) | `--font-display` — the name, headings, figures |
| `newsreader-latin.woff2` | Newsreader | `wght` 300–600, `opsz` 6–72 | `--font-body` — running text |
| `sofia-sans-latin.woff2` | Sofia Sans | `wght` 1–1000 (config uses 400–800) | `--font-label` — labels, meta, the colophon, chart text |
| `jetbrains-mono-latin.woff2` | JetBrains Mono | `wght` 400–700 | `--font-mono` — code only |

All four are licensed under the **SIL Open Font License 1.1**, which permits
self-hosting and redistribution. Licence text: <https://openfontlicense.org>.

- Sofia Sans Condensed — <https://fonts.google.com/specimen/Sofia+Sans+Condensed>
- Sofia Sans — <https://fonts.google.com/specimen/Sofia+Sans>
- Newsreader — <https://fonts.google.com/specimen/Newsreader>
- JetBrains Mono — <https://fonts.google.com/specimen/JetBrains+Mono>

To refresh a file, request the variable range from the `css2` endpoint with a
browser user-agent, take the `latin` block's `woff2` URL, and replace the file in
place — the family name and the config do not change.
