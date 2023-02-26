import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { getFullName } from '~/lib/candidate';
import { getCache, prisma } from '~/lib/db.server';
import { createTitle } from '~/lib/utils';

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

	return !!candidate
		? { ...candidate, lists: candidate?.lists.map(({ listId }) => listId) }
		: undefined;
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

	return transformedLists.reduce<typeof transformedLists>((acc, list) => {
		const existing = acc.find((l) => l.name === list.name && l.province === list.province);
		if (!existing) return [...acc, list];
		const modified = { ...existing, ids: [...existing.ids, ...list.ids] };
		return [...acc.filter((l) => l.ids !== existing.ids), modified];
	}, []);
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
						select: { name: true },
					},
				},
			},
		},
	});

	return positions.map((position) => ({
		list: position.listId,
		number: position.position,
		constituency: position.list.constituency.name,
	}));
};

const getProvinces = () =>
	prisma.province
		.findMany({ select: { name: true, constituencies: { select: { name: true } } } })
		.then((provinces) =>
			provinces.map((p) => ({
				province: p.name,
				constituencies: p.constituencies.map((c) => c.name),
			})),
		);

const getRelevantPositions = (
	lists: Awaited<ReturnType<typeof getLists>>,
	positions: Awaited<ReturnType<typeof getPositions>>,
	provinces: Awaited<ReturnType<typeof getProvinces>>,
) => {
	const transformedPositions = lists.flatMap((list) => {
		const transformed = list.ids.map((id) => ({
			...positions.find((p) => p.list === id)!,
			province: list.province,
		}));

		const cons = provinces.find((p) => p.province === list.province)!.constituencies;
		const allConstituencies = cons.every((c) => transformed.some((t) => t.constituency === c));
		const samePositions = transformed.every((position) => position.number === positions[0].number);

		return samePositions && allConstituencies
			? { name: transformed[0].province, number: positions[0].number }
			: transformed.map(({ constituency, number }) => ({ name: constituency, number }));
	});

	return transformedPositions.sort((a, b) => a.number - b.number);
};

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const candidate = await getFullCandidate(params.id);
	if (!candidate) throw fail(404, { candidate: null });

	const [lists, positions] = await Promise.all([
		getLists(candidate.id),
		getPositions(candidate.id),
		getProvinces(),
	]).then(([lists, positions, provinces]) => {
		return [lists, getRelevantPositions(lists, positions, provinces)] as const;
	});

	setHeaders({ 'cache-control': await getCache() });

	const title = createTitle(getFullName(candidate));

	return { title, candidate, lists, positions };
};

// export const config: Config = {
// 	isr: { expiration: 60 },
// };
