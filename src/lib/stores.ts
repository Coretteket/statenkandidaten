import { createQueryStore, q, type Input } from './search-store';

export const filterOptions = {
  pagina: q.number(1),
  aantal: q.number(15),
	stemlocatie: q.string(),
	gemeente: q.list(),
	partij: q.list(),
} satisfies Input;

export const createFilter = () => createQueryStore(filterOptions);

export type FilterOptions = typeof filterOptions;
export type FilterData = Parameters<ReturnType<typeof createFilter>['set']>[0];
export type FilterStore = ReturnType<typeof createFilter>;
