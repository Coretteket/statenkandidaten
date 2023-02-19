import { error, redirect } from '@sveltejs/kit';

export const load: import('./$types').PageLoad = async ({ url }) => {
	const provinceParam = url.searchParams.get('provincie');
	throw provinceParam ? redirect(307, `/provincie/${provinceParam}`) : error(404, 'Not found');
};
