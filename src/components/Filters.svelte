<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	import { genderOptions, roleOptions } from '~/lib/candidate';
	import { active } from '~/lib/search-store';
	import { createFilter, getConstituency } from '~/lib/stores';
	import { debounce } from '~/lib/utils';
	import type { AllProvinceData } from '~/types/stores';
	import Button from './Button.svelte';
	import Card from './Card.svelte';
	import Collapsible from './Collapsible.svelte';
	import { Close, Filter } from './icons';
	import MultiSelect from './MultiSelect.svelte';
	import Search from './Search.svelte';

	export let data: AllProvinceData;
	export let results: number;

	const filters = createFilter();
	const selectedConstituency = getConstituency();

	$: filterShownClass = $filters.filter ? 'max-lg:overflow-y-hidden' : '';
	$: if (browser) document.documentElement.setAttribute('class', filterShownClass);
	const toggleFilterShown = () => {
		$filters.filter = !$filters.filter;
		pulse = false;
	};

	const mergeURL = (key: string, val: string) => {
		const url = new URL($page.url.href);
		url.searchParams.set(key, val);
		return url.toString();
	};

	let searchTerm = $filters.naam;
	const onSearch = debounce(() => {
		filters.update((f) => ({
			...f,
			naam: searchTerm,
			sorteer: 'relevantie',
			richting: 'oplopend',
			pagina: 1,
		}));
	}, 50);

	let position = $filters.positie;
	const onPositionChange = () => filters.update((f) => ({ ...f, positie: position, pagina: 1 }));

	const expanded = browser ? window.innerWidth > 768 : true;

	const reset = () => {
		searchTerm = '';
		position = 50;
	};

	onMount(() => {browser && window.addEventListener('statenkandidaten:reset', reset)});
	onDestroy(() => browser && window.removeEventListener('statenkandidaten:reset', reset));

	let pulse = browser ? localStorage.getItem('statenkandidaten:pulse') !== 'false' : false;
  $: if (browser) localStorage.setItem('statenkandidaten:pulse', pulse.toString());
</script>

<div
	class="flex flex-col justify-between transition-[top,bottom] duration-200 max-lg:fixed max-lg:left-0 max-lg:top-full max-lg:-bottom-full max-lg:z-10 max-lg:order-last max-lg:h-full max-lg:w-full max-lg:bg-white sm:max-lg:p-8 lg:relative lg:row-span-2"
	class:!top-0={$filters.filter}
	class:!bottom-0={$filters.filter}
>
	<Card
		class="overflow-scroll max-lg:!rounded-none max-lg:pb-28 max-lg:overflow-fade-bottom lg:top-6 lg:[&::-webkit-scrollbar]:hidden"
	>
		<div class="flex justify-between">
			<h2 class="text-xl font-bold text-gray-900">Doorzoek kandidaten</h2>

			<div class="flex items-center lg:hidden">
				<button on:click={toggleFilterShown} class="js-only" title="Sluit filters">
					<Close class="text-gray-800" />
				</button>
				<a href={mergeURL('filter', 'false')} class="no-js" title="Sluit filters">
					<Close class="text-gray-800" />
				</a>
			</div>
		</div>

		<form method="GET" id="filter-form">
			<hr class="border-gray-200" aria-hidden={true} />

			<Collapsible open title="Naam">
				<Search
					name="naam"
					placeholder="Zoek kandidaten op naam..."
					bind:value={searchTerm}
					on:input={onSearch}
				/>
			</Collapsible>

			{#if data.province.constituencies.length > 1}
				<Collapsible open title="Kieskring" selected={$selectedConstituency?.name}>
					<p class="leading-tight text-gray-700">
						Kies de gemeente waar jij woont om kandidaten in jouw kieskring te zien. Dan weet je
						zeker dat ze op je stembiljet staan.
					</p>
					<select
						name="stemlocatie"
						class="w-lg form-select my-1 w-full cursor-pointer rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
						bind:value={$filters.stemlocatie}
						on:change={() => filters.reset('pagina')}
					>
						<option value={null} selected />
						{#each data.municipalities as municipality}
							<option value={municipality.id}>
								{municipality.name}
							</option>
						{/each}
					</select>
				</Collapsible>
			{/if}

			<Collapsible open={expanded} title="Partij" selected={$filters.partij}>
				<MultiSelect name="partij" options={data.parties} />
			</Collapsible>

			<Collapsible title="Positie" selected={position !== 50 ? `≤ ${position}` : undefined}>
				<p class="leading-tight text-gray-700">
					Kies het hoogste nummer dat je op je stembiljet wil zien.
				</p>

				<div>
					<div
						class="-mt-0.5 mb-1 flex justify-between pl-1.5 pr-0.5 text-sm font-semibold text-gray-500"
						aria-hidden={true}
					>
						<span>1</span>
						<span>25</span>
						<span>50</span>
					</div>
					<input
						type="range"
						name="positie"
						class="w-full accent-indigo-600"
						on:change={onPositionChange}
						bind:value={position}
						aria-label="Positie"
						min="1"
						max="50"
						step="1"
					/>
				</div>
			</Collapsible>

			<Collapsible title="Woonplaats" selected={$filters.plaats}>
				<MultiSelect name="plaats" options={data.localities} searchable />
			</Collapsible>

			<Collapsible title="Geslacht" selected={$filters.geslacht}>
				<MultiSelect name="geslacht" options={genderOptions} />
			</Collapsible>

			<Collapsible title="Huidige functie" selected={$filters.functie}>
				<MultiSelect name="functie" options={roleOptions} />
			</Collapsible>

			<div class="mt-6">
				<Button class="no-js !w-full">Bekijk resultaten</Button>
			</div>
		</form>
	</Card>
</div>

<div
	class="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-200 bg-white p-4 px-6 xs:px-10 sm:max-lg:px-[4.5rem] lg:hidden"
	class:js-only={$filters.filter}
>
	<Button
		on:click={toggleFilterShown}
		fallback={mergeURL('filter', 'true')}
		class="relative before:absolute before:-z-10 before:block before:aspect-square before:h-10 before:rounded-full before:bg-indigo-400 before:content-[''] {pulse ? 'pulse' : ''}"
	>
		<div class="flex items-center justify-center gap-3 max-sm:-mx-2">
			{#if $filters.filter}
				<span>
					Bekijk {results}
					{#if results === 1}resultaat{:else}resultaten{/if}
				</span>
			{:else}
				<Filter aria-hidden={true} class="max-xs:hidden" />
				<span>
					Filter kandidaten
					{#if active($filters) > 5}
						<span class="font-medium">({active($filters) - 5} actief)</span>
					{/if}
				</span>
			{/if}
		</div>
	</Button>
</div>

<style>
	:global(.pulse)::before {
		animation: pulse 3s ease infinite;
	}

	@keyframes pulse {
		0%,
		50% {
			transform: scale(1);
			opacity: 100%;
		}

		100% {
			transform: scale(2);
			opacity: 0%;
		}
	}
</style>
