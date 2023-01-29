import { fail } from '@sveltejs/kit';
import { prisma } from '~/scripts/db.server';

const getCounts = async (provinceId: string) => {
	const lists = await prisma.list.findMany({
		include: { candidates: true },
		where: { provinceId },
	});

	return {
		candidates: lists.reduce((acc, list) => acc + list.candidates.length, 0),
		lists: lists.length,
	};
};

const getCandidates = async (provinceId: string) => {
	return await prisma.candidate.findMany({
    where: { list: { provinceId } },
    include: { list: true },
	});
};

export const load: import('./$types').PageServerLoad = async ({ params }) => {
	const province = await prisma.province.findUnique({
		include: { lists: true },
		where: { id: params.id },
	});

	if (!province) throw fail(404, { province: null });

	return {
		province,
		candidates: getCandidates(params.id),
		counts: getCounts(params.id),
	};
};
