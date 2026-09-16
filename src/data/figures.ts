// The figures on the home page.
//
// Hand-entered, read out of data/data.db in the argo-os repo on the date in
// LAST_MEASURED. Wiring these to update themselves (a data/data.db -> JSON export
// the build reads) is a separate job; when it lands it replaces the contents of
// this file and nothing else. No figure here is estimated, rounded up or invented.

export interface Figure {
	label: string;
	/** The number as it should read. `null` means "not counted yet" — rendered as a dash. */
	value: string | null;
	unit: string;
	/** Only on a pending figure: why there is no number yet. */
	note?: string;
}

/** The stacked figures, loudest first. */
export const FIGURES: Figure[] = [
	{ label: 'Kilometres run in 2026', value: '1,027', unit: 'km' },
	{ label: 'Hours trained', value: '215', unit: 'h' },
	{
		label: 'Kilograms lifted',
		value: null,
		unit: 'kg',
		note: 'The strength log starts 20.08.2026. This counts once it covers a year.',
	},
];

/** The quieter strip underneath. */
export const STRIP: { label: string; value: string; qualifier: string }[] = [
	{ label: 'Sessions logged', value: '263', qualifier: '2026' },
	{ label: 'Nights of sleep tracked', value: '395', qualifier: 'since Aug 2025' },
	{ label: 'Kilometres on the bike', value: '821', qualifier: '2026' },
];
