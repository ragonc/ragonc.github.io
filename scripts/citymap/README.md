# citymap: the Zurich map behind the home page

The home page's background is a street map of Zurich drawn from OpenStreetMap:
every street and path, the forests, the lake, the Limmat and the Sihl. It is the
city, not anyone's runs: line brightness follows the street class, and where
streets are dense their lines add up. The data is © OpenStreetMap contributors
under the ODbL, which is why the home page's colophon credits it.

The images in `src/assets/citymap/` are rendered, not drawn by hand. To render
them again, for example after changing a `--map-*` token in `global.css`:

```sh
sh scripts/citymap/fetch.sh            # ~70 MB into scripts/citymap/data/ (gitignored)
python3 scripts/citymap/project.py     # -> data/geo.json
node scripts/citymap/render.mjs        # -> src/assets/citymap/zurich*.webp
```

`render.mjs` reads `--map-ground`, `--map-wood`, `--map-lake`, `--map-road` and
`--map-street` from `src/styles/global.css`; `ALPHA` in the same file is how bright
one street line is before overlaps add up. The veil that darkens the map under
the text is live CSS (`--map-veil-*`), so it needs no re-render. Node 22 or later
(for the built-in WebSocket) and Google Chrome.
