## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## This site

Read `design.md` before changing anything visual — it holds the design system and
the rules behind it. `README.md` covers the layout of the repo.

Two things that are easy to get wrong:

- **No invented numbers.** Every figure on the site is real and dated, out of
  `data/data.db` in the `argo-os` repo. A figure that cannot be counted yet shows a
  dash and says why. Never fill one in to make a page look finished.
- **The words are Carmine's.** Don't write filler copy. A project with nothing to
  say yet gets `page: false`, not a page of generated summary.
