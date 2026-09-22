import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// The writing. These are the three posts that used to live under `argo-tools`;
// the section was renamed in the 2026-09 redesign, old URLs redirect (see
// astro.config.mjs). The `blog` collection is gone — it never had a post in it.
const writing = defineCollection({
	loader: glob({ base: './src/content/writing', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		/** Shown in the byline. The site says out loud where a draft came from. */
		byline: z.string().optional(),
	}),
});

// The portfolio. Software only — what is public is what runs.
const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		/** The one line under the name, on the home page and the section index. */
		description: z.string(),
		/** Sets the chip in the row: lime for live, outlined for parked. */
		state: z.enum(['live', 'parked']),
		/** The rest of the meta line, after the state chip. */
		meta: z.string(),
		/** The number on the right of the row. Real, or left out. */
		figure: z
			.object({
				value: z.string(),
				label: z.string(),
				/** Read from GymLog at build time; `value` is the fallback. See src/data/live.ts. */
				live: z.enum(['sets', 'sessions']).optional(),
			})
			.optional(),
		/** Lower sorts first. */
		order: z.number().default(50),
		/** The standfirst on the project's own page. */
		standfirst: z.string().optional(),
		/** The spec table on the project's own page. */
		spec: z
			.array(
				z.object({
					term: z.string(),
					value: z.string(),
					live: z.enum(['sets', 'sessions']).optional(),
				}),
			)
			.default([]),
		/** The numbered walkthrough under the prose. */
		steps: z.array(z.string()).default([]),
		/** A call-to-action next to the state chip. */
		link: z.object({ href: z.string(), label: z.string() }).optional(),
		/** A captioned box where a screenshot will go. Ignored once `shot` is set. */
		placeholder: z.string().optional(),
		/** The screenshot itself: a file under `public/`, what it shows, and one line under it. */
		shot: z
			.object({
				src: z.string(),
				alt: z.string(),
				width: z.number(),
				height: z.number(),
				caption: z.string().optional(),
			})
			.optional(),
		/**
		 * False when there is nothing to say on a page of its own yet. The row then
		 * links to `href` if it has one, and is plain text if it does not — rather
		 * than opening onto a page of filler.
		 */
		page: z.boolean().default(true),
		/** Where the row points when `page` is false. */
		href: z.string().optional(),
	}),
});

export const collections = { writing, projects };
