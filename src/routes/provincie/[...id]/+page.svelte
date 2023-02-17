<script lang="ts">
	// @hmr:keep-all
	import Anchor from '~/components/Anchor.svelte';
	import Card from '~/components/Card.svelte';
	import Alert from '~icons/mdi/alert-octagon-outline';
	import City from '~icons/mdi/home-city-outline';
	import PartyIcon from '~icons/mdi/account-multiple-outline';
	import Sort from '~icons/mdi/sort';
	import Filter from '~icons/mdi/filter';
	import Close from '~icons/mdi/close';
	import FaceMan from '~icons/mdi/face-man';
	import FaceWoman from '~icons/mdi/face-woman';
	import MultiSelect from '~/components/MultiSelect.svelte';
	import Button from '~/components/Button.svelte';
	import { page } from '$app/stores';
	import { arrayUniqueByKey, switcher } from '~/scripts/utils';
	import Tag from '~/components/Tag.svelte';
	import type { Gender } from '@prisma/client';
	import { createFilter } from '~/scripts/stores';

	const filters = createFilter($page.url);

	export let data: import('./$types').PageData;

	$: municipalities = [...data.municipalities].sort((a, b) =>
		a.name.replace("'s-", '').localeCompare(b.name.replace("'s-", ''), 'nl'),
	);

	$: consMuns = municipalities.filter((m) => m.constituency.provinceId === data.province.id);

	const nf = new Intl.NumberFormat('nl', { minimumIntegerDigits: 2 });

	const listOf = (input: Record<string, boolean>) =>
		Object.entries(input)
			.filter(([_, v]) => v)
			.map(([k]) => k);

	$: candidates = data.candidates
		.filter((c) => {
			const kriFilter =
				!$filters.stemlocatie ||
				c.lists
					.map(
						(l) => data.parties.flatMap((p) => p.lists).find((p) => p.id === l.id)!.constituencyId,
					)
					.some((c) => c === consMuns.find((m) => m.id === $filters.stemlocatie)!.constituencyId);
			const munFilter =
				listOf($filters.gemeente).length > 0
					? $filters.gemeente[slugifyLocality(c.locality ?? '')]
					: true;
			const partyFiler =
				listOf($filters.partij).length > 0
					? c.lists.some((l) =>
							data.parties
								.filter((p) => p.lists.some((pl) => pl.id === l.id))
								.some((p) => $filters.partij[p.id ?? '']),
					  )
					: true;
			return kriFilter && munFilter && partyFiler;
		})
		.slice(($filters.pagina - 1) * $filters.aantal, $filters.pagina * $filters.aantal);

	let filterShown = $page.url.searchParams.get('filter') === 'true';
	$: filterShownStyle = filterShown ? '<style>html{overflow-y:hidden;}</style>' : '';
	const toggleFilterShown = () => (filterShown = !filterShown);

	const mergeURL = (key: string, val: string) => {
		const url = new URL($page.url.href);
		url.searchParams.set(key, val);
		return url.toString();
	};

	const tf = Intl.DateTimeFormat('nl', {
		timeStyle: 'medium',
		dateStyle: 'long',
		timeZone: 'Europe/Amsterdam',
	});
	$: lastUpdate = tf.format(data.lastUpdate);

	const getGender = (gender: Gender | null) =>
		switcher(gender, {
			MALE: 'Man',
			FEMALE: 'Vrouw',
			OTHER: 'Anders',
			default: null,
		});

	const getListName = (candidate: (typeof candidates)[number]) =>
		data.parties
			.filter((p) => p.lists.some((l) => l.id === candidate.lists[0].id))
			.map((p) => p.alias ?? p.name)
			.join('-');

	const changePage = async (num: number) => {
		await filters.update((f) => ({ pagina: f.pagina + num }));
		document.getElementById('candidates')!.scrollIntoView({ behavior: 'smooth' });
	};

	const slugifyLocality = (locality: string) =>
		locality
			.replace(/[ ]/g, '-')
			.replace("'s-", '')
			.replace(/['"\(\)]/g, '')
			.toLocaleLowerCase('nl');

	$: localities = arrayUniqueByKey(
		data.candidates
			.flatMap((c) => ({ id: slugifyLocality(c.locality), name: c.locality }))
			.sort((a, b) => a.id.localeCompare(b.id, 'nl')),
		'id',
	);
</script>

<div class="grid gap-6 lg:grid-cols-content-sidebar">
	<div class="grid gap-6">
		<Card class="!py-12">
			<h1 class="font-gray-900 text-[1.7rem] font-bold leading-[1.25]">
				Kandidaten in {data.province.name.replace('-', '\u2011')}
			</h1>
			<p class="text-lg text-gray-800">
				In {data.province.name} worden er deze verkiezingen
				<span class="font-medium">{data.province.seats} zetels</span>
				verdeeld. Hieronder vind je de
				<span class="font-medium">{data.counts.candidates} mensen</span>
				waaruit je kan kiezen, verdeeld over
				<span class="font-medium">{data.counts.lists} partijen</span>.
			</p>

			<Anchor href={data.province.website} type="external" class="text-lg" icon="w-5.5 h-5.5" />
		</Card>

		<Card class="!flex-row flex-wrap lg:hidden">
			<Button on:click={toggleFilterShown} fallback={mergeURL('filter', 'true')}>
				<Filter /> Filter kandidaten
			</Button>
			<Button type={3}>
				<Sort /> Sorteren
			</Button>
		</Card>

		<Card class="gap-4 lg:-mb-6 lg:min-h-[48rem]" id="candidates">
			{#each candidates as candidate (candidate.id)}
				<a href="/kandidaat/{candidate.id}" class="relative block">
					<div class="mb-2 text-xl">
						<span class="mr-1 text-gray-800">{nf.format(candidate.lists[0].position)}.</span>
						<span class="font-semibold">
							{candidate.firstname ?? candidate.initials}
							{candidate.prefix ?? ''}
							{candidate.surname}
						</span>
					</div>
					<div class="relative h-8 overflow-fade-right">
						<div class="absolute inset-0 flex gap-2 overflow-x-scroll pr-3 scrollbar-hidden">
							<Tag icon={PartyIcon} content={getListName(candidate)} />
							<Tag icon={City} content={candidate.locality} />
							{#if candidate.gender}
								{@const GenderIcon = candidate.gender === 'FEMALE' ? FaceWoman : FaceMan}
								<Tag icon={GenderIcon} content={getGender(candidate.gender)} />
							{/if}
						</div>
					</div>
				</a>
				<hr class="my-1 border-gray-200 last-of-type:hidden" />
			{/each}
		</Card>
		<Card>
			<Button
				on:click={() => changePage(-1)}
				fallback="{mergeURL('pagina', (($filters.pagina ?? 0) + 1).toString())}#candidates"
			>
				Prev
			</Button>
			<Button
				on:click={() => changePage(1)}
				fallback="{mergeURL('pagina', (($filters.pagina ?? 0) + 1).toString())}#candidates"
			>
				Next
			</Button>
		</Card>
	</div>

	<div
		class="flex flex-col justify-between transition-[left,right] duration-200 max-lg:fixed max-lg:top-0 max-lg:left-full max-lg:-right-full max-lg:z-10 max-lg:order-last max-lg:h-[100%] max-lg:bg-white sm:max-lg:p-8 lg:relative lg:row-span-2 lg:h-0 lg:min-h-full "
		class:!left-0={filterShown}
		class:!right-0={filterShown}
	>
		<Card
			class="overflow-scroll max-lg:!rounded-none max-lg:overflow-fade-bottom lg:top-6 lg:[&::-webkit-scrollbar]:hidden"
		>
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-bold text-gray-800">Doorzoek kandidaten</h2>
				<button on:click={toggleFilterShown} class="js-only lg:hidden">
					<Close class="text-gray-800" />
				</button>
				<div class="lg:hidden">
					<a href={mergeURL('filter', 'false')} class="no-js">
						<Close class="text-gray-800" />
					</a>
				</div>
			</div>

			<form method="GET" id="filter-form">
				{#if data.province.constituencies.length > 1}
					<details open class="border-b-2 border-gray-100 py-3">
						<summary class="flex items-center justify-between font-medium">
							<h2>Stemlocatie</h2>
							{#if $filters.stemlocatie}
								<span class="flex items-center gap-1 text-sm text-indigo-600">
									{municipalities.find((c) => c.id === $filters.stemlocatie)?.name}
								</span>
							{:else}
								<span
									class=" flex items-center gap-1 rounded bg-orange-200 py-1 px-2 text-xs font-semibold text-orange-800"
								>
									<Alert class="h-4 w-4" /> Belangrijk
								</span>
							{/if}
						</summary>
						<p class="my-3 text-gray-700">
							Kies de gemeente waar je woont om kandidaten in jouw kieskring te zien. Dan weet je
							zeker dat ze op je stembiljet staan.
						</p>
						<select
							name="stemlocatie"
							class="w-lg form-select my-1 w-full cursor-pointer rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
							bind:value={$filters.stemlocatie}
						>
							<option value="" selected={!$filters.stemlocatie} disabled hidden />
							{#each consMuns as municipality}
								<option value={municipality.id} selected={$filters.stemlocatie === municipality.id}>
									{municipality.name}
								</option>
							{/each}
						</select>
					</details>
				{/if}

				<MultiSelect
					name="partij"
					options={data.parties}
					keys={['name', 'alias']}
					let:selected
					{filters}
					open
				>
					<summary class="flex items-center justify-between font-medium">
						<h2>Partij</h2>
						<span class=" flex items-center gap-1 text-sm text-indigo-600">
							{#if selected.length > 0}{selected.length} geselecteerd{/if}
						</span>
					</summary>

					<p class="my-3 text-gray-700">Kies partijen om alleen kandidaten te zien op die lijst.</p>
				</MultiSelect>

				<MultiSelect
					name="gemeente"
					options={localities}
					keys={['name']}
					let:selected
					{filters}
					open
				>
					<summary class="flex items-center justify-between font-medium">
						<h2>Woonplaats</h2>
						<span class=" flex items-center gap-1 text-sm text-indigo-600">
							{#if selected.length > 0}{selected.length} geselecteerd{/if}
						</span>
					</summary>

					<p class="my-3 text-gray-700">
						Kies gemeentes om alleen kandidaten te zien die daar wonen.
					</p>
				</MultiSelect>

				<div class="mt-4 max-lg:!hidden">
					<Button class="no-js !w-full">Bekijk resultaten</Button>
				</div>
			</form>
		</Card>

		<div class="flex-shrink-0 flex-grow-0 p-8 pt-4 lg:hidden">
			<Button on:click={toggleFilterShown} form="filter-form">
				<span>Bekijk <span class="js-only">{candidates.length} </span>resultaten</span>
			</Button>
		</div>
	</div>
</div>

<footer class="text-gray-500">
	Laatst opgehaald op {lastUpdate}.
</footer>

<svelte:head>
	<title>Statenkandidaten – {data.province.name}</title>
	{@html filterShownStyle}
</svelte:head>
