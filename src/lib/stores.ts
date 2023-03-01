import { derived, writable } from 'svelte/store';
import { createQueryStore, q, type Input, selected } from './search-store';
import { page } from '$app/stores';
import type { FilterCandidates, ProvinceData } from '~/types/stores';
import { slugify } from './candidate';

export const filterOptions = {
	pagina: q.number(1),
	aantal: q.number(15),
	sorteer: q.string('relevantie'),
	richting: q.string('oplopend'),
	naam: q.string(''),
	stemlocatie: q.string(),
	positie: q.number(50),
	plaats: q.list(),
	partij: q.list(),
	geslacht: q.list(),
	functie: q.list(),
	filter: q.boolean(false),
} satisfies Input;

export const createFilter = () => createQueryStore(filterOptions);

export const getConstituency = () =>
	derived([page, createFilter()], ([$page, $filters]) => {
		const municipalities = $page.data.municipalities as ProvinceData<'municipalities'> | undefined;
		return municipalities?.find(({ id }) => id === $filters.stemlocatie)?.constituency;
	});

export const candidates = writable<ProvinceData<'candidates'>>([]);

export const getFilteredCandidates = (options: FilterCandidates) =>
	derived(
		[candidates, createFilter(), getConstituency()],
		([$candidates, $filters, $selectedConstituency]) => {
			const filterOptions = (options: FilterCandidates, c: Required<FilterCandidates>) => {
				const entries = Object.entries(c) as [keyof typeof c, boolean][];
				return entries.every(([key, val]) => options[key] || !selected($filters[key]) || val);
			};

			return $candidates.filter((c) => {
				const stemlocatie = c.lists.some((l) => l.constituency === $selectedConstituency?.id);
				const partij = c.parties.some((p) => $filters.partij[slugify(p.name)]);
				const positie = c.lists
					.filter((l) => !$selectedConstituency || l.constituency === $selectedConstituency?.id)
					.some((l) => l.position <= $filters.positie);
				const plaats = $filters.plaats[slugify(c.locality ?? '')];
				const geslacht = $filters.geslacht[c.gender];
				const functie =
					c.roles.map((r) => $filters.functie[r]).some(Boolean) ||
					($filters.functie.geen && c.roles.length === 0);
				return filterOptions(options, { stemlocatie, partij, positie, plaats, geslacht, functie });
			});
		},
	);
