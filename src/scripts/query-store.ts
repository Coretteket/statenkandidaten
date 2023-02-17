import { goto } from '$app/navigation';
import { get, writable, type Writable } from 'svelte/store';
import type { FilterOptions } from './stores';

const queryOptions = {
	string: <T extends string | undefined = undefined>(value?: T) =>
		({ value: value as T extends string ? string : string | undefined, type: 'string' } as const),
	number: <T extends number | undefined = undefined>(value?: T) =>
		({ value: value as T extends number ? number : number | undefined, type: 'number' } as const),
	list: <T extends string[] | undefined = undefined>(value?: T) =>
		({
			value: value as T extends string[] ? string[] : string[] | undefined,
			type: 'list',
		} as const),
};

export const q = queryOptions;

type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type Input = Record<string, InputOption>;
type InputOption = ReturnType<(typeof queryOptions)[keyof typeof queryOptions]>;
type InputDefaults<T extends Input> = Prettify<{ [K in keyof T]: T[K]['value'] }>;

type QueryData<T extends Input> = Prettify<{
	[K in keyof T]: InputDefaults<T>[K] extends string[] | undefined
		? Record<string, boolean>
		: InputDefaults<T>[K];
}>;

export type InputByType<T extends Input, Q extends keyof typeof queryOptions> = {
	[K in keyof T]: T[K]['type'] extends Q ? K : never;
}[keyof T];

type X = InputByType<FilterOptions, 'list'>;

export const createQueryStore =
	<T extends Input>(input: T) =>
	(url: URL) => {
		const defaults = Object.fromEntries(
			Object.entries(input).map(([key, val]) => {
				if (val.type === 'list') {
					const search = url.searchParams.getAll(key).map((v) => [v, true]);
					const defaults = val.value?.map((v) => [v, true]);
					const obj = Object.fromEntries(search.length > 0 ? search : defaults ?? []);
					return [key, obj] satisfies [string, Record<string, boolean>];
				}

				if (val.type === 'number') {
					const search = url.searchParams.get(key) ? Number(url.searchParams.get(key)) : null;
					return [key, search ?? val.value] satisfies [string, number | undefined];
				}

				const search = url.searchParams.get(key);
				return [key, search ?? val.value] satisfies [string, string | undefined];
			}),
		) as QueryData<T>;

		const store = writable(defaults);

		const buildSearch = (params: QueryData<T>) => {
			const newURL = new URL(url.href);
			const search = new URLSearchParams();

			Object.entries(params).forEach(([k, v]) => {
				if (!v) return;
				if (typeof v === 'object') {
					const values = Object.entries(v).filter(([_, v]) => v);
					values.forEach(([v]) => search.append(k, v));
				} else if (typeof v === 'string' && v.length > 0 && input[k].value !== v) {
					search.append(k, v);
				} else if (typeof v === 'number' && v > 0 && input[k].value !== v) {
					search.append(k, v.toString());
				}
			});

			newURL.search = search.toString();

			return goto(newURL, { replaceState: true, keepFocus: true, noScroll: true });
		};

		const set = async (value: QueryData<T>) => {
			await buildSearch(value);
			store.set(value);
		};

		const update = (updater: (value: QueryData<T>) => Partial<QueryData<T>>) => {
			const val = get(store);
			store.set({ ...val, ...updater(val) });
			return buildSearch(get(store));
		};

		return { subscribe: store.subscribe, set, update };
	};
