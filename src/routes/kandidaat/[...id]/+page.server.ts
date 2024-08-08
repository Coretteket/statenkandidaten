import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getFullName } from '~/lib/candidate';
import { getCache, prisma } from '~/lib/db.server';
import { createMeta, createTitle } from '~/lib/meta';

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
			incumbent: true,
			parliament: true,
			senate: true,
			deputy: true,
			lists: { select: { position: true, listId: true } },
		},
	});

	const roles = Object.entries({
		statenlid: candidate?.incumbent,
		gedeputeerde: candidate?.deputy,
		kamerlid: candidate?.parliament,
		senator: candidate?.senate,
	})
		.map(([k, v]) => (v ? k : null))
		.filter(Boolean) as ('statenlid' | 'gedeputeerde' | 'kamerlid')[];

	return !!candidate
		? { ...candidate, roles, lists: candidate?.lists.map(({ listId }) => listId) }
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
			: cons.map((c) => ({
					name: c,
					number: transformed.find((l) => l.constituency === c)?.number,
			  }));
	});

	return transformedPositions.sort((a, b) => (a.number ?? 1e3) - (b.number ?? 1e3));
};

export const load = (async ({ params, setHeaders }) => {
	const candidate = await getFullCandidate(params.id);
	if (!candidate) error(404, { message: 'Kandidaat niet gevonden' });

	const [lists, positions] = await Promise.all([
		getLists(candidate.id),
		getPositions(candidate.id),
		getProvinces(),
	]).then(([lists, positions, provinces]) => {
		return [lists, getRelevantPositions(lists, positions, provinces)] as const;
	});

	setHeaders({ 'cache-control': await getCache() });

	const meta = createMeta({
		title: createTitle(getFullName(candidate)),
		image: `/api/og/kandidaat/${candidate.id}.png`,
		username: candidate.id,
		firstname: candidate.firstname ?? candidate.initials,
		surname: [candidate.prefix, candidate.surname].filter(Boolean).join(' '),
		gender: candidate.gender ?? undefined,
	});

	return { meta, candidate, lists, positions };
}) satisfies PageServerLoad;
