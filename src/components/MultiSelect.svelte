<script lang="ts">
	import Fuse from 'fuse.js';
	import type { InputByType } from '~/lib/search-store';
	import type { FilterStore, FilterOptions } from '~/lib/stores';
	import { arrayUniqueByKey } from '~/lib/utils';

	export let name: InputByType<FilterOptions, 'list'>;
	export let options: { id: string; name: string; alias?: string | null }[];
	export let keys: Fuse.FuseOptionKey<(typeof options)[number]>[];
	export let filters: FilterStore;
	export let open = false;

	let searchTerm = '';
	let showAll = true;

	const fuse = new Fuse(options, { keys, includeScore: true });

	const getResults = (searchTerm: string) => {
		if (searchTerm === '') return options;
		const search = fuse.search(searchTerm);
		return search.filter((m) => m.score && m.score < 0.5).map((m) => m.item);
	};

	$: searchResults = getResults(searchTerm);
	$: selected = options.filter((o) => $filters[name][o.id]);

	$: shownOptions = arrayUniqueByKey([...selected, ...searchResults], 'id');

	let showScrollIndicator = options.length > 10;
</script>

<details {open} class="border-b-2 border-gray-100 py-3">
	<slot {selected} />

	<input
		bind:value={searchTerm}
		placeholder="Zoek op {name}..."
		class="js-only form-input mb-2 w-full flex-1 rounded-md border-gray-300 px-4 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
	/>

	<div
		class="relative -mx-1 max-h-52 overflow-auto px-1 overflow-fade-bottom"
		on:scroll|once={() => (showScrollIndicator = false)}
	>
		{#each shownOptions as option (option.id)}
			<label class="my-2.5 flex items-center gap-3 leading-4">
				<input
					type="checkbox"
					class="form-checkbox rounded border-gray-300 text-indigo-600 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:ring-offset-0"
					bind:checked={$filters[name][option.id]}
					value={option.id}
					{name}
				/>
				{option.alias ?? option.name}
			</label>
		{/each}
		<!-- <div class="absolute js-only bottom-2 w-fit text-center" class:hidden={!showScrollIndicator}>
			<span class="rounded bg-indigo-100 py-1 px-2 text-xs font-semibold text-indigo-900">
				Scroll voor meer opties...
			</span>
		</div> -->
	</div>

	{#if searchResults.length > shownOptions.length}
		<button
			on:click|preventDefault={() => (showAll = !showAll)}
			class="text-underline js-only mt-2 inline-block cursor-pointer font-medium text-indigo-600 hover:underline [input:checked~&]:hidden"
		>
			{#if showAll}Bekijk minder...{:else}Bekijk alle...{/if}
		</button>
	{/if}
</details>
