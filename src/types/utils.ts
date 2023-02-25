export interface Omit {
	<T extends object, K extends [...(keyof T)[]]>(obj: T, ...keys: K): {
		[K2 in Exclude<keyof T, K[number]>]: T[K2];
	};
}

export type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];

export type Values<T> = T extends Record<any, infer U> ? U : never;

export type Prettify<T> = { [K in keyof T]: T[K] } & {};
