import { dev } from '$app/environment';
import { fail, redirect } from '@sveltejs/kit';
import { prisma } from '~/scripts/db.server';
import { get } from '@vercel/edge-config';
import { arrayUniqueByKey, omit } from '~/scripts/utils';

const getCounts = async (provinceId: string) => {
	const candidatesPromise = prisma.candidate.count({
		where: { lists: { some: { list: { constituency: { provinceId } } } } },
	});

	const listsPromise = prisma.list.findMany({
		where: { constituency: { provinceId } },
	});

	const [candidates, lists] = await Promise.all([candidatesPromise, listsPromise]);
	return { candidates, lists: arrayUniqueByKey(lists, 'name').length };
};

const getCandidates = (provinceId: string) => {
	return prisma.candidate
		.findMany({
			where: { lists: { some: { list: { constituency: { provinceId } } } } },
			include: { lists: { include: { list: { select: { id: true } } } } },
			orderBy: [{ surname: 'asc' }],
		})
		.then((c) => {
			const candidates = c.map((b) => omit(b, 'incumbent', 'elected'));
			return candidates.map((c) => {
				const lists = c.lists.map((l) => ({ id: l.list.id, position: l.position }));
				return { ...c, lists };
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

const getMunicipalities = async () => {
	const getName = (m: { name: string }) => m.name.replace("'s-", '');
	return (
		await prisma.municipality.findMany({
			include: { constituency: true },
		})
	).sort((a, b) => getName(a).localeCompare(getName(b), 'nl'));
};

export const load: import('./$types').PageServerLoad = async ({ params, setHeaders }) => {
	const province = await prisma.province.findUnique({
		include: { constituencies: { include: { lists: { include: { party: true } } } } },
		where: { id: params.id },
	});

	if (!province) throw redirect(307, '/404');

	const cache = !dev ? await get('cache-control') : undefined;
	if (cache) setHeaders({ 'cache-control': cache });

	return {
		province,
		parties: getParties(params.id),
		candidates: getCandidates(params.id),
		counts: getCounts(params.id),
		municipalities: getMunicipalities(),
		lastUpdate: new Date(),
	};
};

// export const config = {
// 	isr: { expiration: 24 * 60 * 60 },
// };
