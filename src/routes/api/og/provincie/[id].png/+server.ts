import { error, type RequestHandler } from '@sveltejs/kit';
import { ImageResponse } from '../../render';
import type { Config } from '@sveltejs/adapter-vercel';

import Image from './Image.svelte';
import { getCache, prisma } from '~/lib/db.server';

export const GET: RequestHandler = async ({ params }) => {
	if (!params.id) throw error(404, { message: 'Provincie niet gevonden' });

	const props = { name: 'jouw provincie' };

	if (params.id !== 'general') {
		const province = await prisma.province.findUnique({
			where: { id: params.id },
			select: { name: true },
		});
		if (!province) throw error(404, { message: 'Provincie niet gevonden' });
		props.name = province.name;
	}

	return ImageResponse(Image, {
		fonts: { family: 'Inter', weights: [400, 600, 700] },
		headers: { 'cache-control': await getCache() },
		props,
	});
};
