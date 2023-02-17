export interface Omit {
	<T extends object, K extends [...(keyof T)[]]>(obj: T, ...keys: K): {
		[K2 in Exclude<keyof T, K[number]>]: T[K2];
	};
}

export const omit: Omit = (obj, ...keys) => {
	const ret = {} as {
		[K in keyof typeof obj]: (typeof obj)[K];
	};
	let key: keyof typeof obj;
	for (key in obj) {
		if (!keys.includes(key)) {
			ret[key] = obj[key];
		}
	}
	return ret;
};

const debouncer = (callback: Function, wait: number) => {
	let timeoutId: number | null = null;
	return () => {
		if (timeoutId) window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(callback, wait);
	};
};

type Values<T> = T extends Record<any, infer U> ? U : never;

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

export const arrayUniqueByKey = <T extends {}>(arr: T[], key: keyof T) =>
	arr.filter((v) => v).filter((v, i, a) => a.findIndex((t) => t[key] === v[key]) === i);

export const createTitle = (val?: string) => {
	const initial = 'Statenkandidaten';
	return !val || val.length === 0 ? initial : `${initial} - ${val}`;
};
