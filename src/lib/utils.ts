import type { Omit, Values } from '~/types/utils';

export const shuffle = <T>(array: T[]) => {
	let currentIndex = array.length;
	let randomIndex;
	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
	return array;
};

export const omit: Omit = (obj, ...keys) => {
	const ret = {} as { [K in keyof typeof obj]: (typeof obj)[K] };
	let key: keyof typeof obj;
	for (key in obj) if (!keys.includes(key)) ret[key] = obj[key];
	return ret;
};

export const switcher = <
	T extends string | number | symbol,
	U extends { [t in T]: any } & { default?: any },
>(
	value: T | null | undefined,
	cases: U,
): U extends { default: any } ? Values<U> : Values<U> | null => {
	return value && value in cases ? cases[value] : cases.default ?? null;
};

export const debounce = <T extends Function>(cb: T, wait = 200) => {
	let h: ReturnType<typeof setTimeout>;
	const callable = (...args: any) => {
		clearTimeout(h);
		h = setTimeout(() => cb(...args), wait);
	};
	return <T>(<any>callable);
};

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const arrayUniqueByKey = <T extends {}>(arr: T[], key: keyof T) =>
	arr.filter((v) => v).filter((v, i, a) => a.findIndex((t) => t[key] === v[key]) === i);

export const arrayUnique = <T>(arr: T[]) =>
	arr.filter((v) => v).filter((v, i, a) => a.indexOf(v) === i);

export const createTitle = (val?: string, initial = 'Statenkandidaten') =>
	!val || val.length === 0 ? initial : `${val} – ${initial}`;
