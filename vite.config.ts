import { sveltekit } from '@sveltejs/kit/vite';
import icons from 'unplugin-icons/vite';

export default {
	plugins: [sveltekit(), icons({ compiler: 'svelte', autoInstall: true })],
} satisfies import('vite').UserConfig;
