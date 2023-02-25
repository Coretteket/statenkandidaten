import type { PageLoad } from './$types';
import { createTitle } from '~/lib/utils';

export const load: PageLoad = async () => {
	return { title: createTitle('Veelgestelde vragen') };
};

export const prerender = true;
