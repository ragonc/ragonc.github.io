# Fonts

The three faces of the design system, self-hosted rather than loaded from
`fonts.googleapis.com`. Two reasons: the colophon says "no tracking", and a build
that fetches fonts over the network is a build that breaks when someone else's API
does.

Each file is the **latin subset of the variable font**, taken from Google Fonts on
2026-09-16. The weight range in `astro.config.mjs` must stay inside the range the
file actually carries, or the browser synthesises the weight and the condensed
display face stops looking condensed.

| File | Family | Axis range | Used for |
| --- | --- | --- | --- |
| `big-shoulders-display-latin.woff2` | Big Shoulders Display | `wght` 400–800 | `--font-display` — figures, headings, the wordmark |
| `newsreader-latin.woff2` | Newsreader | `wght` 300–600, `opsz` 6–72 | `--font-body` — running text |
| `jetbrains-mono-latin.woff2` | JetBrains Mono | `wght` 400–700 | `--font-mono` — labels, meta, the colophon |

All three are licensed under the **SIL Open Font License 1.1**, which permits
self-hosting and redistribution. Licence text: <https://openfontlicense.org>.

- Big Shoulders Display — <https://fonts.google.com/specimen/Big+Shoulders+Display>
- Newsreader — <https://fonts.google.com/specimen/Newsreader>
- JetBrains Mono — <https://fonts.google.com/specimen/JetBrains+Mono>

To refresh a file, request the variable range from the `css2` endpoint with a
browser user-agent, take the `latin` block's `woff2` URL, and replace the file in
place — the family name and the config do not change.
