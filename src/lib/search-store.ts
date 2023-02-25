import { goto } from '$app/navigation';
import { get, writable } from 'svelte/store'; // @ts-ignore

const constructOption =
	<V>(type: V) =>
	<K>() =>
	<T extends K | undefined = undefined>(value?: T) => ({
		value: value as T extends K ? K : K | undefined,
		type,
	});

const queryOptions = {
	string: constructOption('string' as const)<string>(),
	number: constructOption('number' as const)<number>(),
	list: constructOption('list' as const)<string[]>(),
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
			const search = new URLSearchParams();

			for (const key in params) {
				const val = params[key];
				if (typeof val === 'object') {
					const values = Object.entries(val).filter(([_, v]) => v);
					values.forEach(([v]) => search.append(key, v));
				} else if (
					((typeof val === 'string' && val.length > 0) || (typeof val === 'number' && val > 0)) &&
					input[key].value !== val
				) {
					search.append(key, val.toString());
				}
			}

			const newURL = new URL(url.href);
			newURL.search = search.toString();

			return goto(newURL, { replaceState: true, keepFocus: true, noScroll: true });
		};

		const set = (value: QueryData<T>) => {
			buildSearch(value);
			store.set(value);
		};

		const update = (updater: (value: QueryData<T>) => Partial<QueryData<T>>) => {
			store.update((val) => ({ ...val, ...updater(val) }));
			return buildSearch(get(store));
		};

		return { subscribe: store.subscribe, set, update };
	};
