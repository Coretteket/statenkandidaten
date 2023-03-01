import type { createFilter, filterOptions } from '~/lib/stores';
import type { load as provinceLoad } from '../routes/provincie/[...id]/+page.server';
import type { load as candidateLoad } from '../routes/kandidaat/[...id]/+page.server';

export type FilterOptions = typeof filterOptions;
export type FilterData = Parameters<ReturnType<typeof createFilter>['set']>[0];
export type FilterStore = ReturnType<typeof createFilter>;

export type FilterCandidates = Partial<
	Record<
		keyof Omit<FilterData, 'pagina' | 'aantal' | 'naam' | 'filter' | 'sorteer' | 'richting'>,
		boolean | undefined
	>
>;

export type ProvinceData<T extends keyof Awaited<ReturnType<typeof provinceLoad>>> = Awaited<
	Awaited<ReturnType<typeof provinceLoad>>[T]
>;

export type AllProvinceData = {
	[x in keyof Awaited<ReturnType<typeof provinceLoad>>]: Awaited<
		Awaited<ReturnType<typeof provinceLoad>>[x]
	>;
};

export type CandidateData<T extends keyof Awaited<ReturnType<typeof candidateLoad>>> = Awaited<
	Awaited<ReturnType<typeof candidateLoad>>[T]
>;
