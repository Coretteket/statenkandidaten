import { createMeta, createTitle } from '~/lib/meta';
import type { PageServerLoad } from './$types';
import { prisma } from '~/lib/db.server';

export const load: PageServerLoad = async () => {
	const provinces = prisma.province.findMany({ orderBy: { name: 'asc' } });
	const meta = createMeta({ title: createTitle('Vind kandidaten in jouw provincie') });
	return { provinces, meta };
};

export const prerender = true;
