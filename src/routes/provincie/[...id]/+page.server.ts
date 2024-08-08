import type { PageServerLoad, Actions, EntryGenerator } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { getCache, prisma } from '~/lib/db.server';
import { getFullName, slugify } from '~/lib/candidate';
import { createMeta, createTitle } from '~/lib/meta';
import { arrayUniqueByKey, omit, switcher } from '~/lib/utils';

const getCandidates = async (provinceId: string) => {
	const candidates = await prisma.candidate.findMany({
		where: { lists: { some: { list: { constituency: { provinceId } } } } },
		include: { lists: { include: { list: { include: { constituency: true, party: true } } } } },
		orderBy: [{ surname: 'asc' }],
	});

	return candidates.map((c) => {
		const lists = c.lists
			.filter((l) => l.list.constituency.provinceId === provinceId)
			.map((l) => ({
				id: l.list.id,
				position: l.position,
				constituency: l.list.constituencyId,
				alias: l.list.alias,
			}));

		const parties = c.lists.flatMap(({ list }) =>
			list.party.map((p) => ({ id: p.id, name: p.alias ?? p.name })),
		);

		const fullname = getFullName(c);

		const gender = switcher(c.gender, {
			MALE: 'man',
			FEMALE: 'vrouw',
			default: 'onbekend',
		} as const);

		const roles = Object.entries({
			statenlid: c.incumbent,
			gedeputeerde: c.deputy,
			kamerlid: c.parliament,
			senator: c.senate,
		})
			.map(([k, v]) => (v ? k : null))
			.filter(Boolean) as ('statenlid' | 'gedeputeerde' | 'kamerlid' | 'senator')[];

		return {
			id: c.id,
			locality: c.locality,
			surname: c.surname,
			fullname,
			gender,
			parties,
			lists,
			roles,
		};
	});
};

const getParties = async (provinceId: string) => {
	const parties = await prisma.party.findMany({
		where: { lists: { some: { constituency: { provinceId } } } },
		select: {
			id: true,
			name: true,
			alias: true,
			lists: {
				select: {
					position: true,
					constituency: { select: { provinceId: true } },
				},
			},
		},
	});

	const getPosition = (p: (typeof parties)[number]) =>
		p.lists.find((l) => l.constituency.provinceId === provinceId)?.position ?? 0;

	return parties
		.sort((a, b) => getPosition(a) - getPosition(b))
		.map((p) => ({ id: p.id, name: p.alias ?? p.name }));
};

const getMunicipalities = async (provinceId: string) => {
	const getName = (m: { name: string }) => m.name.replace("'s-", '');
	const municipalities = await prisma.municipality.findMany({
		where: { constituency: { provinceId } },
		include: { constituency: true },
	});
	return municipalities.sort((a, b) => getName(a).localeCompare(getName(b), 'nl'));
};

export const load = (async ({ params, setHeaders }) => {
	const province = await prisma.province.findUnique({
		include: { constituencies: { include: { lists: { include: { party: true } } } } },
		where: { id: params.id },
	});

	if (!province) error(404, { message: 'Provincie niet gevonden' });

	setHeaders({ 'cache-control': await getCache() });

	const meta = createMeta({
		title: createTitle(`Kandidaten in ${province.name}`),
		image: `/api/og/provincie/${province.id}.png`,
	});

	const candidates = getCandidates(params.id);

	const localities = candidates.then((candidates) =>
		arrayUniqueByKey(
			candidates
				.flatMap((c) => ({ id: slugify(c.locality), name: c.locality }))
				.sort((a, b) => a.id.localeCompare(b.id, 'nl')),
			'id',
		),
	);

	return {
		meta,
		province,
		parties: await getParties(params.id),
		municipalities: await getMunicipalities(params.id),
		candidates: await candidates,
		localities: await localities,
	};
}) satisfies PageServerLoad;

// export const actions: Actions = {
// 	navigate: async ({ request }) => {
// 		const provinceParam = (await request.formData()).get('provincie');
// 		throw provinceParam
// 			? redirect(302, `/provincie/${provinceParam}`)
// 			: error(404, { message: 'Provincie niet gevonden' });
// 	},
// };

export const entries: EntryGenerator = async () => {
	const provinces = await prisma.province.findMany({ select: { id: true } });
	return provinces.map(({ id }) => ({ id }));
};

export const prerender = true;
