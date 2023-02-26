export type Meta = {
	url: URL;
	title: string;
	'meta:title'?: string;
	description: string;
	image: `/api/og/${string}`;
	'image:width': string;
	'image:height': string;
	username?: string;
	firstname?: string;
	lastname?: string;
	gender?: string;
};

export const defaultMeta = (url: URL): Meta => ({
	url,
	title: 'Statenkandidaten',
	description:
		'Op 15 maart mogen we weer stemmen, maar op wie eigenlijk? Op Statenkandidaten.nl vind jij de kandidaat die het beste bij jou past.',
	image: `/api/og/general.png`,
	'image:width': '1200',
	'image:height': '630',
});

export const mergeMeta = <T extends Partial<Meta>>(url: URL, meta?: T): Meta =>
	Object.assign(defaultMeta(url), meta ?? {});

export const createMeta = <T extends Partial<Meta>>(meta: T) => meta;

export const createTitle = (val?: string, initial = 'Statenkandidaten') =>
	!val || val.length === 0 ? initial : `${val} – ${initial}`;
