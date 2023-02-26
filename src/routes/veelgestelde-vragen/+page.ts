import type { PageLoad } from './$types';
import { createMeta, createTitle } from '~/lib/meta';

export const load: PageLoad = async () => ({
	meta: createMeta({ title: createTitle('Veelgestelde vragen') }),
});

export const prerender = true;
