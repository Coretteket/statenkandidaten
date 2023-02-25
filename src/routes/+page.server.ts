import type { PageServerLoad } from './$types';
import { prisma } from '~/lib/db.server';

export const load: PageServerLoad = async () => {
	const provinces = prisma.province.findMany({ orderBy: { name: 'asc' } });
	return { provinces };
};

export const prerender = true;
