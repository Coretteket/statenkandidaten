/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />

import type { Meta } from './lib/meta';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	namespace App {
		interface Error {
			message: string;
		}
		// interface Locals {}
		interface PageData {
			meta: Partial<Meta>;
		}
		// interface Platform {}
	}
}
