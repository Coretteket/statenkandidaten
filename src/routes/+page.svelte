<script lang="ts">
	import { onMount } from 'svelte';
	import Anchor from '~/components/Anchor.svelte';
	import Button from '~/components/Button.svelte';
	import Card from '~/components/Card.svelte';
	import Map from '~/components/Map.svelte';

	export let data: import('./$types').PageServerData;

	let selectedProvince: string;
	$: provinceURL = selectedProvince ? `/provincie/${selectedProvince}` : undefined;

	// Only disabled when JS is enabled, and no province has been selected.
	onMount(() => document.querySelector('#provButton')!.setAttribute('disabled', 'true'));
</script>

<Card class="py-12 sm:!py-16">
	<h1 class="max-w-lg text-3xl font-extrabold text-gray-900 md:mt-0 md:text-4xl">
		Doorzoek alle kandidaten voor de Provinciale Staten
	</h1>
	<p class="my-2 text-lg text-gray-800">
		Op <b class="font-semibold">15 maart 2023</b>
		mogen we weer stemmen, maar op wie eigenlijk? Wij hebben alle kandidaten voor de Provinciale Staten
		in jouw provincie verzameld<span class="max-sm:hidden"
			>, zodat je ze makkelijk kan doorzoeken op partij, woonplaats, geslacht en meer</span
		>. Zo vind jij de kandidaat die het beste bij jou past!
	</p>
	<div class="mt-3 flex flex-wrap gap-4">
		<Button href="/#provincies">Zoek in mijn provincie</Button>
		<Button href="/#provincies" type={3}>Bekijk alle kandidaten</Button>
	</div>
</Card>

<div class="flex flex-col gap-6 md:flex-row" id="provincies">
	<Card class="flex-[7] justify-center">
		<h2 class="text-2xl font-semibold text-gray-900">Kies een provincie</h2>
		<p class="text-lg text-gray-800">
			In elke provincie doen andere kandidaten mee. Kies dus eerst een provincie uit de lijst
			hieronder, of
			<b class="font-medium text-gray-900">
				klik op jouw provincie op de kaart
				<span class="hidden md:inline">hiernaast.</span>
				<span class="md:hidden">hieronder.</span>
			</b>
		</p>

		<hr class="my-2" />

		<form method="GET" action="/provincie">
			<select
				name="provincie"
				bind:value={selectedProvince}
				class="form-select mt-1 w-full cursor-pointer rounded-md border-gray-300 py-3 px-4 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
			>
				<option selected hidden value="">Selecteer een provincie...</option>
				{#each data.provinces as province}
					<option value={province.id}>{province.name}</option>
				{/each}
			</select>
			<Button class="mt-4 mb-2" href={provinceURL} id="provButton" type={2}>
				Ga naar provincie
			</Button>
		</form>
	</Card>

	<Card class="flex-[4] justify-center !p-8">
		<Map class="mx-auto max-w-xs" />
	</Card>
</div>

<Card>
	<h2 class="text-2xl font-semibold text-gray-900">Over de verkiezingen</h2>
	<div class="my-4 grid gap-12 text-gray-800 md:grid-cols-2">
		<div class="flex flex-col gap-3">
			<b class="text-lg font-medium">Waarom zou ik stemmen?</b>
			<p>
				In de provincie worden besluiten genomen die invloed hebben op jouw dagelijks leven. Jouw
				stem op de Provinciale Staten bepaalt namelijk hoe we onze ruimte verdelen, hoe we omgaan
				met milieu en energie, hoe we zorgen voor natuur en water, hoe makkelijk we rond kunnen
				reizen én hoe we de economie in de regio het beste aanjagen.
			</p>
			<Anchor
				href="https://nos.nl/video/2462437-ps23-een-spoedcursus-over-provinciale-staten-in-4-minuten"
			>
				Bekijk explainer op NOS.nl
			</Anchor>

			<Anchor
				href="https://www.rijksoverheid.nl/onderwerpen/verkiezingen/vraag-en-antwoord/provinciale-statenverkiezingen"
			/>
		</div>
		<div class="flex flex-col gap-3">
			<b class="text-lg font-medium">Hoe kan ik stemmen?</b>
			<p>
				Je krijgt een stempas op de post. Neem deze en een geldig identiteitsbewijs op 15 maart mee
				naar een stembureau. Daar krijg je een stembiljet en een rood potlood. Ga naar een
				stemhokje, kleur het rondje in voor de persoon op wie jij wilt stemmen, vouw het stembiljet
				op zodat niemand kan zien wie jij kiest en doe het stembiljet in de stembus.
			</p>

			<Anchor href="https://waarismijnstemlokaal.nl/">Vind een stembureau in de buurt</Anchor>
			<Anchor
				href="https://www.rijksoverheid.nl/onderwerpen/verkiezingen/vraag-en-antwoord/hoe-stemmen-bij-de-verkiezingen"
			/>
		</div>
	</div>
</Card>
