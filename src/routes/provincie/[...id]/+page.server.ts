import { dev } from '$app/environment';
import { error, fail, redirect } from '@sveltejs/kit';
import { prisma } from '~/scripts/db.server';
import { get } from '@vercel/edge-config';
import { arrayUniqueByKey, omit } from '~/scripts/utils';

const getCandidates = (provinceId: string) => {
	return prisma.candidate
		.findMany({
			where: { lists: { some: { list: { constituency: { provinceId } } } } },
			include: { lists: { include: { list: { select: { id: true } } } } },
			orderBy: [{ surname: 'asc' }],
		})
		.then((candidates) => {
			return candidates.map((c) => {
				const { initials, firstname, prefix, surname, elected, incumbent, lists: _, ...rest } = c;
				const lists = c.lists.map((l) => ({ id: l.list.id, position: l.position }));
				const fullname = [firstname ?? initials, prefix, surname].filter(Boolean).join(' ');
				return { ...rest, lists, fullname };
			});
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

export const load: import('./$types').PageServerLoad = async ({ params, setHeaders }) => {
	const province = await prisma.province.findUnique({
		include: { constituencies: { include: { lists: { include: { party: true } } } } },
		where: { id: params.id },
	});

	if (!province) throw redirect(307, '/404');

	setHeaders({ 'cache-control': !dev ? (await get('cache-control')) ?? 'public' : 'public' });

	return {
		province,
		parties: getParties(params.id),
		candidates: getCandidates(params.id),
		municipalities: getMunicipalities(params.id),
		lastUpdate: new Date(),
	};
};

export const actions = {
	navigate: async ({ request }) => {
		const provinceParam = (await request.formData()).get('provincie');
		throw provinceParam ? redirect(302, `/provincie/${provinceParam}`) : error(404, 'Not found');
	},
} satisfies import('./$types').Actions;
