import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get, writable, type Updater } from 'svelte/store';
import type { Entries, Prettify } from '~/types/utils';

const constructOption =
	<V>(type: V) =>
	<K>() =>
	<T extends K | null = null>(value?: T) => ({
		value: (value ?? null) as T extends K ? K : K | null,
		type,
	});

const queryOptions = {
	string: constructOption('string' as const)<string>(),
	number: constructOption('number' as const)<number>(),
	list: constructOption('list' as const)<string[]>(),
};

export const q = queryOptions;

const GOTO_OPTIONS = {
	keepFocus: true,
	noScroll: true,
	replaceState: true,
};

export const createQueryStore = <T extends Input>(input: T) => {
	type Defaults = { [t in keyof T]: T[t]['value'] };
	type Stored = Prettify<{
		[t in keyof T]: Defaults[t] extends string[] | null ? Record<string, boolean> : Defaults[t];
	}>;

	const { set, subscribe } = writable<Stored>();

	const entries = Object.entries(input);

	let setter: (value: Stored) => Promise<void> = async () => {};

	const unsubPage = page.subscribe(($page) => {
		const search = $page.url.searchParams;
		const values = Object.fromEntries(
			entries.map((entry) => {
				if (entry[1].type === 'string') {
					return [entry[0], search.get(entry[0]) ?? entry[1].value];
				} else if (entry[1].type === 'number') {
					return [entry[0], Number(search.get(entry[0]) ?? entry[1].value)];
				} else if (entry[1].type === 'list') {
					const list = search.getAll(entry[0]);
					return [entry[0], Object.fromEntries(list.map((item) => [item, true])) ?? entry[1].value];
				}
			}) as Entries<Stored>,
		) as Stored;
		set(values);
		setter = (value) => {
			const search = new URLSearchParams($page.url.search);
			Object.entries(value).forEach((entry) => {
				search.delete(entry[0]);
				if (entry[1] && entry[1] !== input[entry[0]].value) {
					if (typeof entry[1] === 'string') {
						search.set(entry[0], entry[1]);
					} else if (typeof entry[1] === 'number') {
						search.set(entry[0], entry[1].toString());
					} else if (typeof entry[1] === 'object') {
						Object.entries(entry[1]).forEach(([k, v]) => {
							if (v) search.append(entry[0], k);
						});
					}
				}
			});
			return goto(`?${search}`, GOTO_OPTIONS);
		};
	});

	const reset = (key: keyof Stored) => {
		setter({ ...get({ subscribe }), [key]: input[key].value });
	};

	const sub = (...props: Parameters<typeof subscribe>) => {
		const unsub = subscribe(...props);
		return () => {
			if (browser) unsubPage();
			unsub();
		};
	};

	return {
		subscribe: sub,
		set: setter,
		reset,
		update: (updater: Updater<Stored>) => {
			const currentValue = get({ subscribe });
			const newValue = updater(currentValue);
			return setter(newValue);
		},
	};
};

export type Input = Record<string, InputOption>;
type InputOption = ReturnType<(typeof queryOptions)[keyof typeof queryOptions]>;

export type InputByType<T extends Input, Q extends keyof typeof queryOptions> = {
	[K in keyof T]: T[K]['type'] extends Q ? K : never;
}[keyof T];
