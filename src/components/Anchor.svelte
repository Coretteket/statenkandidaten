<script lang="ts">
	import { Arrow, Back } from './icons';

	export let href: string;
	export let newtab = true;
	export let type: 'back' | 'external' = 'external';

	const getDomain = (url: string) => new URL(url).hostname.split('.').slice(-2).join('.');

	$: icon = type === 'back' ? Back : Arrow;
</script>

<a
	class="flex items-center gap-2 font-medium text-indigo-600 hover:underline"
	target={newtab ? '_blank' : null}
	rel={newtab ? 'noreferrer noopener' : null}
	{...$$restProps}
	{href}
>
	<svelte:component this={icon} class="h-5 w-5" />
	<slot>
		{#if type === 'back'}
			Terug naar overzicht
		{:else}
			Lees meer op {getDomain(href)}
		{/if}
	</slot>
</a>
