// The figures read from GymLog at build time, instead of typed in.
//
// gymlog.runthenumbers.ch/stats.json answers Carmine's own totals and nothing else
// (see projects/gymlog/docs/system.md in argo-os). The build fetches it once; the
// daily scheduled deploy is what keeps it fresh. When GymLog cannot be reached the
// build does not fail: every live figure falls back to the value typed next to it
// in the content file, and the colophon falls back to LAST_MEASURED.

import { LAST_MEASURED } from '../consts';

const STATS_URL = 'https://gymlog.runthenumbers.ch/stats.json';

export interface GymLogStats {
	sets: number;
	sessions: number;
	last_set: string | null;
	as_of: string;
}

/** The fields a content file may point a figure at with `live:`. */
export type LiveKey = 'sets' | 'sessions';

async function read(): Promise<GymLogStats | null> {
	try {
		const response = await fetch(STATS_URL, { signal: AbortSignal.timeout(5000) });
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		const body = await response.json();
		if (!Number.isInteger(body.sets) || !Number.isInteger(body.sessions) || !body.as_of) {
			throw new Error(`unexpected shape: ${JSON.stringify(body)}`);
		}
		return body as GymLogStats;
	} catch (error) {
		console.warn(`[live] GymLog stats unavailable, using the typed-in figures: ${error}`);
		return null;
	}
}

export const GYMLOG = await read();

/** A live figure as it should read, or the typed-in one when there is none. */
export function liveValue(fallback: string, key?: LiveKey): string {
	if (!key || !GYMLOG) return fallback;
	return GYMLOG[key].toLocaleString('en-US');
}

/** The colophon's date: when GymLog was read, in Zurich, or the typed-in date. */
export const LAST_READ = GYMLOG
	? new Date(GYMLOG.as_of).toLocaleDateString('de-CH', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			timeZone: 'Europe/Zurich',
		})
	: LAST_MEASURED;
