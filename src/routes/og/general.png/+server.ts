import type { RequestHandler } from '@sveltejs/kit';
import { ImageResponse } from '../render';

import Image from './Image.svelte';

export const GET: RequestHandler = async ({}) => {
	return ImageResponse(Image, {
		fonts: { family: 'Inter', weights: [400, 600, 700] },
	});
};

export const prerender = true;
