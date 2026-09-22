// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// The four faces of the design system. Self-hosted from src/assets/fonts rather
// than fetched from Google at build time: the colophon promises no tracking, and
// the build should not depend on someone else's API being up. Each file is the
// latin subset of the variable font — see src/assets/fonts/README.md before
// touching a weight range here.
const face = (name, cssVariable, file, weight, fallbacks) => ({
	provider: fontProviders.local(),
	name,
	cssVariable,
	fallbacks,
	options: {
		variants: [
			{
				src: [`./src/assets/fonts/${file}`],
				weight,
				style: 'normal',
				display: 'swap',
			},
		],
	},
});

// https://astro.build/config
export default defineConfig({
	site: 'https://runthenumbers.ch',
	integrations: [mdx(), sitemap()],
	redirects: {
		// The section was called "argo-tools" until the 2026-09 redesign. Those URLs
		// are out in the world; keep them working.
		'/argo-tools': '/writing/',
		'/argo-tools/[...slug]': '/writing/[...slug]',
		// /blog never had a post in it, so there is no slug to carry over.
		'/blog': '/writing/',
	},
	fonts: [
		face('Sofia Sans Condensed', '--font-display', 'sofia-sans-condensed-latin.woff2', '400 800', [
			'Arial Narrow',
			'sans-serif',
		]),
		face('Newsreader', '--font-body', 'newsreader-latin.woff2', '300 600', ['Georgia', 'serif']),
		face('Sofia Sans', '--font-label', 'sofia-sans-latin.woff2', '400 800', ['system-ui', 'sans-serif']),
		// Code only: inline code and code blocks in posts. Labels moved to Sofia Sans
		// on 23.09.2026.
		face('JetBrains Mono', '--font-mono', 'jetbrains-mono-latin.woff2', '400 700', [
			'ui-monospace',
			'monospace',
		]),
	],
});
