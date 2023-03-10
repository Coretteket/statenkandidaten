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
	U extends Partial<{ [t in T]: any }> & { default?: any },
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

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const arrayUniqueByKey = <T extends {}>(arr: T[], key: keyof T) =>
	arr.filter((v) => v).filter((v, i, a) => a.findIndex((t) => t[key] === v[key]) === i);

export const arrayUnique = <T>(arr: T[]) =>
	arr.filter((v) => v).filter((v, i, a) => a.indexOf(v) === i);

export const shorten = (str: string, max = 20) =>
	str.length > max ? str.slice(0, max - 3) + '…' : str;

export const easterEgg = () => {
	console.log(
		'%cStatenkandidaten',
		'background:#312e81;color:#ebebeb;font-size:2.5em;font-family:Inter;font-weight:800;padding:10px 20px;border-radius:10px',
	);
	console.log('https://github.com/coretteket/statenkandidaten');
};
