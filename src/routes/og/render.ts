import { html } from 'satori-html';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { TTF_USER_AGENT } from '$env/static/private';

type Component = {
	render: (options?: { [key: string]: any }) => {
		html: string;
		css: { code: string; map: string };
	};
};

type ImageResponseOptions = {
	fonts: FontLoadOptions;
	width?: number;
	height?: number;
	headers?: ResponseInit['headers'];
	props?: { [key: string]: any };
};

const isComponent = (component: any): component is Component => {
	return component && component.render && typeof component.render === 'function';
};

export const ImageResponse = async (component: unknown, options: ImageResponseOptions) => {
	if (!isComponent(component)) throw new Error('Component is not a Svelte component.');

	const result = component.render(options.props);
	const markup = result.html.replace(/class=/g, 'tw=');
	const element = html(markup);

	const svg = await satori(element, {
		fonts: await setGoogleFonts(options.fonts),
		width: options.width ?? 1200,
		height: options.height ?? 630,
	});

	const resvg = new Resvg(svg, {
		fitTo: { mode: 'width', value: options.width ?? 1200 },
	});

	const image = resvg.render();

	return new Response(image.asPng(), {
		headers: { 'content-type': 'image/png', ...options.headers },
	});
};

type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

type FontLoadOptions = { family: string; weights: Weight[] };

export const setGoogleFonts = async (fonts: FontLoadOptions) => {
	return loadGoogleFont(fonts).then((data) =>
		data.map((f, i) => ({
			name: fonts.family,
			weight: fonts.weights[i],
			data: f,
		})),
	);
};

export const loadGoogleFont = async ({
	family,
	weights,
	text,
}: {
	family: string;
	weights?: Weight[];
	text?: string;
}) => {
	const params: Record<string, string> = {
		family: `${encodeURIComponent(family)}${weights ? `:wght@${weights.join(';')}` : ''}`,
	};

	if (text) params.text = text;
	else params.subset = 'latin';

	const url = `https://fonts.googleapis.com/css2?${Object.keys(params)
		.map((key) => `${key}=${params[key]}`)
		.join('&')}`;

	const css = await fetch(`${url}`, {
		headers: { 'User-Agent': TTF_USER_AGENT },
	}).then((res) => res.text());

	const fontURLs = Array.from(
		css.matchAll(/src: url\((.+)\) format\('(opentype|truetype)'\)/g),
	).map((m) => m[1]);

	if (!fontURLs) throw new Error('Could not find font URLs');

	return Promise.all(fontURLs.map((fontUrl) => fetch(fontUrl).then((res) => res.arrayBuffer())));
};
