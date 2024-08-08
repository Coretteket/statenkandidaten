import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { get } from '@vercel/edge-config';

export const load: PageServerLoad = async () => {
	const tikkie = await get<string>('tikkie');
	if (tikkie) redirect(302, tikkie);
	else error(404, 'Tikkie niet gevonden');
};
