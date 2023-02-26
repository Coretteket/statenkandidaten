import type { PageServerLoad, Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { getCache, prisma } from '~/lib/db.server';
import { getFullName } from '~/lib/candidate';
import { createMeta, createTitle } from '~/lib/meta';

const getCandidates = async (provinceId: string) => {
	const candidates = await prisma.candidate.findMany({
		where: { lists: { some: { list: { constituency: { provinceId } } } } },
		include: { lists: { include: { list: true } } },
		orderBy: [{ surname: 'asc' }],
	});

	return candidates.map((c) => {
		const { initials, firstname, prefix, surname, elected, incumbent, lists: _, ...rest } = c;
		const lists = c.lists.map((l) => ({
			id: l.list.id,
			position: l.position,
			constituency: l.list.constituencyId,
			alias: l.list.alias,
		}));
		const fullname = getFullName(c);
		return { ...rest, lists, fullname };
	});
};

const getParties = (provinceId: string) => {
	return prisma.party.findMany({
		where: { lists: { some: { constituency: { provinceId } } } },
		select: {
			id: true,
			name: true,
			alias: true,
			lists: {
				select: {
					id: true,
					name: true,
					constituencyId: true,
				},
			},
		},
	});
};

const getMunicipalities = async (provinceId: string) => {
	const getName = (m: { name: string }) => m.name.replace("'s-", '');
	const municipalities = await prisma.municipality.findMany({
		where: { constituency: { provinceId } },
		include: { constituency: true },
	});
	return municipalities.sort((a, b) => getName(a).localeCompare(getName(b), 'nl'));
};

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const province = await prisma.province.findUnique({
		include: { constituencies: { include: { lists: { include: { party: true } } } } },
		where: { id: params.id },
	});

	if (!province) throw redirect(307, '/404');

	setHeaders({ 'cache-control': await getCache() });

	const meta = createMeta({ title: createTitle(`Kandidaten in ${province.name}`) });

	return {
		meta,
		province,
		parties: getParties(params.id),
		candidates: getCandidates(params.id),
		municipalities: getMunicipalities(params.id),
		lastUpdate: new Date(),
	};
};

export const actions: Actions = {
	navigate: async ({ request }) => {
		const provinceParam = (await request.formData()).get('provincie');
		throw provinceParam ? redirect(302, `/provincie/${provinceParam}`) : error(404, 'Not found');
	},
};
