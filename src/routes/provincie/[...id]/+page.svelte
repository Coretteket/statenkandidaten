<script lang="ts">
	import {
		City,
		Party,
		FaceMan,
		FaceWoman,
		Incumbent,
		Chevron,
		SortAsc,
		SortDesc,
	} from '~/components/icons';

	import Card from '~/components/Card.svelte';
	import Button from '~/components/Button.svelte';
	import Tag from '~/components/Tag.svelte';
	import Anchor from '~/components/Anchor.svelte';

	import { formatPosition, getPosition } from '~/lib/candidate';
	import { capitalize, debounce } from '~/lib/utils';
	import { createFilter, getConstituency, candidates, getFilteredCandidates } from '~/lib/stores';
	import { selected } from '~/lib/search-store';

	import { PUBLIC_SESSION_KEY } from '$env/static/public';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	import Fuse from 'fuse.js';
	import { onMount } from 'svelte';
	import Filters from '~/components/Filters.svelte';

	export let data: import('./$types').PageServerData;

	const filters = createFilter();
	const selectedConstituency = getConstituency();

	// Save filter state to session storage for back button on candidate pages.
	$: if (browser) {
		sessionStorage.setItem(PUBLIC_SESSION_KEY, $page.url.pathname + $page.url.search);
	}

	$: fuse = new Fuse(data.candidates, { keys: ['fullname'], threshold: 0.5 });

	$: $candidates = selected($filters.naam)
		? fuse.search($filters.naam).map((r) => r.item)
		: data.candidates;

	$: filteredCandidates = getFilteredCandidates({});

	$: shownCandidates = $filteredCandidates
		.sort((a, b) => {
			if ($filters.sorteer === 'naam') {
				if ($filters.richting === 'oplopend') return a.surname.localeCompare(b.surname);
				else return b.surname.localeCompare(a.surname);
			} else if ($filters.sorteer === 'positie') {
				const getPos = (c: typeof a) => getPosition(c.lists, $selectedConstituency?.id);
				if ($filters.richting === 'oplopend') return getPos(a) - getPos(b);
				else return getPos(b) - getPos(a);
			} else return 0;
		})
		.slice(($filters.pagina - 1) * $filters.aantal, $filters.pagina * $filters.aantal);

	const mergeURL = (key: string, val: string) => {
		const url = new URL($page.url.href);
		url.searchParams.set(key, val);
		return url.toString();
	};

	const changePage = async (num: number) => {
		await filters.update((f) => ({ ...f, pagina: f.pagina + num }));
		document.documentElement.scrollIntoView({ behavior: 'smooth' });
	};

	$: maxPages = Math.max(Math.ceil($filteredCandidates.length / $filters.aantal), 1);

	const setBound = (pagina: number) => {
		if (pagina < 1) filters.update((f) => ({ ...f, pagina: 1 }));
		else if (pagina > maxPages) filters.update((f) => ({ ...f, pagina: maxPages }));
	};

	$: if (browser) setBound($filters.pagina);
	onMount(() => setBound($filters.pagina));

	const sortToggle = () =>
		filters.update((f) => ({
			...f,
			richting: f.richting === 'aflopend' ? 'oplopend' : 'aflopend',
			pagina: 1,
		}));
</script>

<div class="grid gap-6 lg:grid-cols-content-sidebar">
	<div class="grid gap-6">
		<Card class="!py-12" id="main">
			<h1 class="font-gray-900 text-[1.7rem] font-bold leading-[1.25]">
				Kandidaten in {data.province.name.replace('-', '\u2011')}
			</h1>
			<p class="text-lg text-gray-800">
				In {data.province.name} worden deze verkiezingen
				<span class="font-medium">{data.province.seats} zetels</span>
				verdeeld. Op deze pagina vind je de
				<span class="font-medium">{data.candidates.length} kandidaten</span>
				waaruit je kan kiezen, verdeeld over
				<span class="font-medium">{data.parties.length} partijen</span>.
        Gebruik filters om specifieke kandidaten te vinden.
			</p>
			<Anchor href={data.province.website} />
		</Card>

		<Card id="candidates">
			<div
				class="js-only flex flex-wrap items-center justify-center gap-y-4 gap-x-6 text-gray-900 sm:justify-between lg:-mt-2 "
			>
				<span class="text-lg font-medium max-sm:hidden">
					{$filteredCandidates.length}
					{#if $filteredCandidates.length === 1}resultaat{:else}resultaten{/if}
				</span>
				<div class="flex flex-wrap items-center gap-y-1 gap-x-3">
					<span class="text-gray-600">Sorteer op</span>
					<div class="flex items-center gap-2 ">
						<select
							name="sorteer"
							class="form-select cursor-pointer rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
							bind:value={$filters.sorteer}
							on:change={() => filters.reset('pagina')}
							title="Sorteer op..."
						>
							<option value="relevantie">Relevantie</option>
							<option value="naam">Achternaam</option>
							<option value="positie">Positie</option>
						</select>
						<button
							class="flex aspect-square h-10 cursor-pointer items-center justify-center rounded-md border border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:cursor-default disabled:opacity-30"
							on:click={sortToggle}
							disabled={$filters.sorteer === 'relevantie'}
							title={$filters.richting === 'oplopend' ? 'Sorteer aflopend' : 'Sorteer oplopend'}
						>
							{#if $filters.richting === 'aflopend' && $filters.sorteer !== 'relevantie'}
								<SortDesc class="h-5 w-5" />
							{:else}
								<SortAsc class="h-5 w-5" />
							{/if}
						</button>
					</div>
				</div>
			</div>

			<hr class="my-1 border-gray-200" aria-hidden={true} />

			<ul class="grid gap-4">
				{#each shownCandidates as candidate, i (candidate.id)}
					{@const href = `/kandidaat/${candidate.id}`}

					<li class="grid gap-2">
						<a {href} class="text-xl">
							<span class="mr-1 text-gray-800">
								{formatPosition(candidate.lists, $selectedConstituency?.id)}.
							</span>
							<span class="font-semibold">{candidate.fullname}</span>
						</a>

						<div class="relative h-8 overflow-fade-right">
							<div class="absolute inset-0 flex gap-2 overflow-x-scroll pr-3 scrollbar-hidden">
								<Tag icon={Party} content={candidate.parties[0].name} {href} />
								<Tag icon={City} content={candidate.locality} {href} />
								{#if candidate.gender !== 'onbekend'}
									{@const GenderIcon = candidate.gender === 'vrouw' ? FaceWoman : FaceMan}
									<Tag icon={GenderIcon} content={capitalize(candidate.gender)} {href} />
								{/if}
								{#if candidate.roles.length > 0}
									<Tag icon={Incumbent} content={capitalize(candidate.roles[0])} {href} />
								{/if}
							</div>
						</div>

						<hr class="my-1 mt-4 border-gray-200" aria-hidden={true} />
					</li>
				{:else}
					<li class="my-2 text-lg text-gray-800">
						<b class="font-semibold">Geen kandidaten gevonden</b>
						<p class="my-2 text-gray-700 leading-snug">
							Voor deze zoekopdracht zijn geen kandidaten gevonden. Probeer filters te veranderen,
							<span class="max-lg:hidden">in het menu rechts van deze lijst.</span>
							<span class="lg:hidden">door op de paarse knop onderin het scherm te klikken.</span>
							<span class="js-only"
								>Of <button
									on:click={() => filters.reset()}
									class="text-indigo-600 hover:underline font-medium">verwijder alle filters</button
								>.</span
							>
						</p>
						<hr class="my-1 mt-8 border-gray-200" aria-hidden={true} />
					</li>
				{/each}
			</ul>

			<div class="mt-4 flex justify-between gap-6">
				<Button
					type={1}
					class="!aspect-square !w-12 !p-2"
					on:click={() => changePage(-1)}
					fallback={mergeURL('pagina', (($filters.pagina ?? 0) - 1).toString())}
					disabled={$filters.pagina === 1}
					title="Vorige pagina"
				>
					<Chevron class="h-8 w-8 rotate-180" aria-hidden={true} />
				</Button>
				<div class="flex items-center gap-3 font-medium text-gray-700">
					<span class="max-sm:hidden">Pagina</span>
					<input
						type="number"
						class="form-input w-10 rounded-md border-gray-300 !px-0 text-center focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
						bind:value={$filters.pagina}
						aria-label="Paginanummer"
						min={1}
						max={maxPages}
					/>
					van {maxPages}
				</div>
				<Button
					type={1}
					class="!aspect-square !w-12 !p-2"
					on:click={() => changePage(1)}
					fallback={mergeURL('pagina', (($filters.pagina ?? 0) + 1).toString())}
					title="Volgende pagina"
					disabled={$filters.pagina === maxPages}
				>
					<Chevron class="h-8 w-8 " aria-hidden={true} />
				</Button>
			</div>
		</Card>
	</div>

	<Filters {data} results={$filteredCandidates.length} />
</div>
