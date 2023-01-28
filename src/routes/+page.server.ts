import { prisma } from '~/scripts/db.server';

export const load: import('./$types').PageServerLoad = async () => {
	const provinces = prisma.province.findMany({
		include: { lists: { include: { candidates: true } } },
	});

  return { provinces };
};
