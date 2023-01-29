import { error, redirect } from '@sveltejs/kit';

export const load: import('./$types').PageLoad = async ({ url }) => {
	const province = url.searchParams.get('provincie');
	if (province) throw redirect(307, `/provincie/${province}`);
	throw error(404, { message: 'Not found' });
};
