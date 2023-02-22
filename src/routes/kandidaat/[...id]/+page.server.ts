import { dev } from '$app/environment';
import { fail } from '@sveltejs/kit';
import { get } from '@vercel/edge-config';
import { prisma } from '~/scripts/db.server';
import { arrayUniqueByKey } from '~/scripts/utils';

const getFullCandidate = async (id: string) => {
	const candidate = await prisma.candidate.findUnique({
		where: { id },
		select: {
			id: true,
			initials: true,
			firstname: true,
			prefix: true,
			surname: true,
			gender: true,
			locality: true,
			lists: { select: { listId: true } },
		},
	});

	if (!candidate) return undefined;

	return { ...candidate, lists: candidate?.lists.map(({ listId }) => listId) };
};

const getLists = async (candidateId: string) => {
	const lists = await prisma.list.findMany({
		where: { candidates: { some: { candidateId } } },
		include: { party: true, constituency: { include: { province: true } } },
	});

	const transformedLists = lists.map((list) => ({
		ids: [list.id],
		name: list.name,
		position: list.position,
		province: list.constituency.province.name,
		parties: list.party.map((p) => p.id),
		links: {
			party: list.party.map((p) => p.website).filter(Boolean),
			province: list.constituency.province.website,
		},
	}));

	const uniqueLists = transformedLists.reduce<typeof transformedLists>((acc, list) => {
		const existing = acc.find((l) => l.name === list.name && l.province === list.province);
		if (!existing) return [...acc, list];
		const modified = { ...existing, ids: [...existing.ids, ...list.ids] };
		return [...acc.filter((l) => l.ids !== existing.ids), modified];
	}, []);

	return uniqueLists;
};

const getPositions = async (candidateId: string) => {
	const positions = await prisma.candidatesOnList.findMany({
		where: { candidateId },
		select: {
			position: true,
			listId: true,
			list: {
				select: {
					constituency: {
						select: {
							name: true,
						},
					},
				},
			},
		},
	});

	console.log(positions);

	const transformedPositions = positions.map((position) => ({
		list: position.listId,
		number: position.position,
		constituency: position.list.constituency.name,
	}));

	return transformedPositions;
};

const getRelevantPositions = (
	lists: Awaited<ReturnType<typeof getLists>>,
	positions: Awaited<ReturnType<typeof getPositions>>,
) =>
	lists
		.flatMap((list) => {
			const transformed = list.ids.map((id) => ({
				...positions.find((p) => p.list === id)!,
				province: list.province,
			}));
			if (transformed.every((position) => position.number === positions[0].number))
				return { name: transformed[0].province, number: positions[0].number };
			return transformed.map(({ constituency, number }) => ({ name: constituency, number }));
		})
		.sort((a, b) => a.number - b.number);

export const load: import('./$types').PageServerLoad = async ({ params, setHeaders }) => {
	const candidate = await getFullCandidate(params.id);
	if (!candidate) throw fail(404, { candidate: null });

	const [lists, positions] = await Promise.all([
		getLists(candidate.id),
		getPositions(candidate.id),
	]);

	const relevantPositions = getRelevantPositions(lists, positions);

	const cache = !dev ? await get('cache-control') : undefined;
	if (cache) setHeaders({ 'cache-control': cache });

	return { candidate, lists, positions: relevantPositions };
};
