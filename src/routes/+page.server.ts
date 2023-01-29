import { prisma } from '~/scripts/db.server';

export const prerender = true;

export const load: import('./$types').PageServerLoad = async () => {
	const provinces = prisma.province.findMany({ orderBy: { name: 'asc' } });
	return { provinces };
};
