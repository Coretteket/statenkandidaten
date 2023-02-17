import type { Writable } from 'svelte/store';

export type Filters = {
	stemlocatie: string;
	gemeentes: string[];
	partijen: string[];
};

export type FilterStore = Writable<Filters>;
