import { error, type RequestHandler } from '@sveltejs/kit';
import type { Config } from '@sveltejs/adapter-vercel';

import Image from './Image.svelte';
import { ImageResponse } from '../../render';
import { getCache, prisma } from '~/lib/db.server';
import { formatPosition, getFullName, getListName } from '~/lib/candidate';
import { arrayUnique, shorten } from '~/lib/utils';

const getCandidate = (id: string) =>
	prisma.candidate.findUnique({
		where: { id },
		include: {
			lists: { include: { list: { include: { constituency: { include: { province: true } } } } } },
		},
	});

const getParties = () => prisma.party.findMany({ include: { lists: true } });

export const GET: RequestHandler = async ({ params }) => {
	if (!params.id) throw error(404, 'Candidate not found');

	const [candidate, parties] = await Promise.all([getCandidate(params.id), getParties()]);
	if (!candidate) throw error(404, 'Candidate not found');

	const name = shorten(getFullName(candidate), 22);

	const provinces = arrayUnique(candidate.lists.map(({ list }) => list.constituency.province.name));
	const position = formatPosition(candidate.lists);
	const party = shorten(getListName(candidate.lists[0].list, parties), 34 - provinces[0].length);

	return ImageResponse(Image, {
		fonts: { family: 'Inter', weights: [400, 600, 700, 800] },
		props: { name, party, provinces, position },
		headers: { 'cache-control': await getCache() },
	});
};

export const config = { runtime: 'nodejs18.x' } satisfies Config;
