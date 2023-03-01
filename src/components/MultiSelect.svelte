<script lang="ts">
	import Fuse from 'fuse.js';
	import { onMount } from 'svelte';
	import { slugify } from '~/lib/candidate';
	import type { InputByType } from '~/lib/search-store';
	import { createFilter, getFilteredCandidates } from '~/lib/stores';
	import type { FilterOptions } from '~/types/stores';
	import { arrayUniqueByKey, switcher } from '~/lib/utils';
	import Search from './Search.svelte';

	export let name: InputByType<FilterOptions, 'list'>;
	export let options: { id: string; name: string }[];
	export let searchable = false;
	export let show = 6;

	const filters = createFilter();
	const candidates = getFilteredCandidates({ [name]: true });

	const fuse = searchable ? new Fuse(options, { keys: ['name'], threshold: 1 }) : null;
	let searchTerm = '';

	$: selected = options.filter((o) => $filters[name][o.id]);
	$: subset = arrayUniqueByKey([...options.slice(0, show), ...selected], 'id');
	$: defaultOptions = !showAll ? subset : options;

	$: results = fuse?.search(searchTerm).map(({ item }) => item) ?? [];
	$: searchOptions = !showAll ? results?.slice(0, show) : results;
	$: shownOptions = searchable && searchTerm.length > 0 ? searchOptions : defaultOptions;

	$: getCount = switcher(name, {
		partij: (id: string) => $candidates.filter((c) => c.parties.some((p) => p.id === id)).length,
		geslacht: (id: string) => $candidates.filter((c) => c.gender === id).length,
		plaats: (id: string) => $candidates.filter((c) => slugify(c.locality) === id).length,
		functie: (id: string) =>
			$candidates.filter((c) => (id === 'geen' ? c.roles.length === 0 : c.roles.includes(id)))
				.length,
		default: (_: string) => 0,
	});

	let showAll = true,
		mounted = false;
	onMount(() => {
		showAll = false;
		mounted = true;
	});
</script>

<div>
	{#if searchable}
		<Search bind:value={searchTerm} placeholder="Zoek {name} in lijst..." class="js-only" />
	{/if}

	<div class:hidden-kids={!mounted} class:mt-4={searchable}>
		{#each shownOptions as option (option.id)}
			<label class="my-2 flex items-start gap-3 leading-4">
				<input
					type="checkbox"
					class="form-checkbox mt-0.5 rounded border-gray-300 text-indigo-600 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 focus:ring-offset-0"
					bind:checked={$filters[name][option.id]}
					on:change={() => filters.reset('pagina')}
					value={option.id}
					{name}
				/>
				<span class="leading-tight">
					{option.name}
					<span class="text-gray-600">
						({getCount(option.id)})
					</span>
				</span>
			</label>
		{/each}
	</div>

	{#if options.length > show}
		<button
			on:click|preventDefault={() => (showAll = !showAll)}
			class="text-underline js-only mt-1 inline-block cursor-pointer font-medium text-indigo-600 hover:underline"
		>
			Bekijk {#if showAll && mounted}minder{:else}alle{/if}...
		</button>
	{/if}
</div>

<!--
  Styles to assist in hiding all options when Javascript is enabled,
  but showing all options in cases without Javascript.
-->

<svelte:head>
	<noscript>
		<style>
			.hidden-kids > * {
				display: flex !important;
			}
		</style>
	</noscript>
</svelte:head>

<style>
	.hidden-kids > * {
		display: none;
	}

	.hidden-kids > *:nth-child(-n + 6) {
		display: flex;
	}
</style>
