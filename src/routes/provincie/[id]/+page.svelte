<script lang="ts">
	import Anchor from '~/components/Anchor.svelte';
	import Button from '~/components/Button.svelte';
	import Card from '~/components/Card.svelte';

	export let data: import('./$types').PageData;

	$: provinceHost = new URL(data.province.website).hostname.split('.').slice(-2).join('.');
</script>

<div class="grid gap-6 lg:grid-cols-content-sidebar">
	<Card>
		<h1 class="font-gray-900 text-2xl font-semibold">
			<span class="max-sm:hidden">Kandidaten in </span>{data.province.name}
		</h1>
		<p class="text-gray-900">
			In {data.province.name} worden er deze verkiezingen
			<span class="font-medium">{data.province.seats} zetels</span>
			verdeeld in de Provinciale Staten. Hieronder vind je de
			<span class="font-medium">{data.counts.candidates} mensen</span>, verdeeld over
			<span class="font-medium">{data.counts.lists} partijen</span>, waaruit je kan kiezen. Maak
			gebruik van de zoekfunctie om kandidaten te filteren op naam, partij, woonplaats, en meer.
		</p>
		<Anchor href={data.province.website} />

		<!-- <pre class="max-w-sm overflow-scroll">{JSON.stringify(data, null, 2)}</pre> -->
	</Card>

	<div class="relative lg:row-span-2">
		<Card
			class="lg:sticky lg:top-6 lg:max-h-[calc(100vh_-_3rem)] lg:overflow-y-scroll lg:[&::-webkit-scrollbar]:hidden"
		>
			<h1 class="font-gray-800 text-2xl font-medium">Zoeken</h1>
			<!-- <input type="text" class="form-input" /> -->
			{#each Array(1) as _}
				<p class="max-sm:hidden">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis quae possimus
					dignissimos officia consequuntur! Eligendi quasi quo aperiam reprehenderit, perspiciatis
					sed quos modi, adipisci fugit laboriosam tempora a nobis dolores.
				</p>
			{/each}
		</Card>
	</div>

	<Card>
		{#each data.candidates as candidate}
			<p>
				{candidate.position}
				{candidate.name}
				{candidate.list.name}
				{candidate.age}
				{candidate.gender}
        {candidate.municipality}
			</p>
		{/each}
	</Card>
</div>
