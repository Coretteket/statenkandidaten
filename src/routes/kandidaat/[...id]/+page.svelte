<script lang="ts">
	import Anchor from '~/components/Anchor.svelte';
	import Button from '~/components/Button.svelte';
	import Card from '~/components/Card.svelte';
	import Row from '~/components/Row.svelte';
	import SEO from '~/components/SEO.svelte';

	import { getFullName, getGender, getOfficialName, slugify } from '~/lib/candidate';
	import { arrayUnique } from '~/lib/utils';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	export let data: import('./$types').PageServerData;

	$: fullName = getFullName(data.candidate);
	$: officialName = getOfficialName(data.candidate);

	$: partyLinks = arrayUnique(data.lists.flatMap((list) => list.links.party));
	$: provinceLinks = data.lists.map((list) => list.links.province);
	$: links = partyLinks.concat(provinceLinks);

	const sessionURL = browser ? localStorage.getItem('province:filters') : undefined;
	const fallbackURL = `/provincie/${slugify(data.lists[0].province)}`;
	const backURL =
		// Only use session URL if it's a province URL
		sessionURL?.startsWith('/provincie') &&
		// Only use if it's a province that the candidate is on the list for
		data.lists.some((l) => sessionURL.includes(slugify(l.province)))
			? sessionURL
			: fallbackURL;
</script>

<div class="grid gap-6 lg:grid-cols-content-sidebar">
	<div class="space-y-6">
		<Card>
			<h1 class="font-gray-900 mb-2 text-[1.7rem] font-bold leading-[1.25]">
				{fullName}
			</h1>

			<div>
				<Row title={'Lijst' + (data.lists.length > 1 ? 'en' : '')}>
					<div class="col-span-2 space-y-3">
						{#each data.lists as list}
							<div class="my-0.5 leading-6">
								<div class="font-semibold text-indigo-600 " title={list.name}>
									{list.name}
								</div>
								<div class="text-gray-700">
									Lijst
									<span class="font-semibold text-gray-800">{list.position}</span>
									in
									<span class="font-semibold text-gray-800">{list.province}</span>
								</div>
							</div>
						{/each}
					</div>
				</Row>

				<Row title={'Lijstpositie' + (data.positions.length > 1 ? 's' : '')}>
					<div class="col-span-2 space-y-2">
						{#each data.positions as position}
							<div class="text-gray-800">
								<span class="font-semibold text-indigo-600">
									nr. {position.number}
								</span>
								{#if data.positions.length > 1}
									in {position.name}
								{/if}
							</div>
						{/each}
					</div>
					<div slot="details">
						De lijstpositie geeft aan op welke plaats op een lijst deze kandidaat staat. Dit nummer
						(samen met het lijstnummer) helpt je dus met het vinden van deze kandidaat op je
						stembiljet.
						{#if data.positions.length > 1}
							<p class="mt-2">
								<b>Let op:</b> Deze kandidaat staat op verschillende plaatsen afhankelijk van waar jij
								woont, kijk dus goed op je stembiljet! Het is ook mogelijk dat deze kandidaat niet op
								jouw stembiljet staat.
							</p>
						{/if}
					</div>
				</Row>

				<Row title="Naam op biljet">
					<div class="col-span-2 font-semibold text-indigo-600">{officialName}</div>
					<div slot="details">
						Dit is hoe de naam van deze kandidaat op je stembiljet zal staan.
						{#if data.candidate.firstname}
							Met als eerst de achternaam, daarna de voorletters en als laatst de voornaam tussen
							haakjes.
						{:else}
							Met als eerst de achternaam, en daarna de voorletters. De partij van deze kandidaat
							heeft ervoor gekozen om de voornaam niet te publiceren.
						{/if}
					</div>
				</Row>

				<Row title="Woonplaats">
					<div class="col-span-2 font-semibold text-indigo-600">{data.candidate.locality}</div>
				</Row>

				<Row title="Geslacht" hideButton={!!data.candidate.gender}>
					<div
						class="col-span-2 font-semibold text-indigo-600"
						class:!text-gray-600={!data.candidate.gender}
					>
						{getGender(data.candidate.gender)}
					</div>
					<div slot="details">
						Het geslacht van deze kandidaat is niet bekend. De partij van deze kandidaat heeft
						ervoor gekozen om dit niet te publiceren.
					</div>
				</Row>
			</div>

			<Button type={3} href={backURL} class="mt-3">Terug naar overzicht</Button>
		</Card>
	</div>

	<div class="flex flex-col gap-6">
		<Card class="max-lg:order-2">
			<h2 class="text-xl font-bold text-gray-900">Verantwoording</h2>
			<p class="text-gray-800">
				Deze pagina is gebaseerd op de officiële kandidatenlijsten die zijn opgesteld <a
					href="https://www.kiesraad.nl/actueel/nieuws/2023/02/14/kandidatenlijsten-provinciale-statenverkiezingen-definitief"
					class="font-medium text-indigo-600 hover:underline"
					target="_blank"
					rel="noreferrer noopener">door de Kiesraad</a
				>. Deze website is onafhankelijk gemaakt. Vragen over de data, of toch een fout ontdekt?
				Bekijk dan de
				<a
					href="/veelgestelde-vragen"
					class="font-medium text-indigo-600 hover:underline"
					target="_blank"
					rel="noreferrer noopener">veelgestelde vragen</a
				>.
			</p>
		</Card>

		<Card>
			<div class="space-y-4 md:-my-2">
				<h2 class="text-xl font-semibold text-gray-800">Meer informatie</h2>

				<div class="space-y-2">
					{#each links as href}
						<Anchor {href} />
					{/each}
					<Anchor href="https://google.nl/search?q={fullName}">Zoek kandidaat op Google</Anchor>
				</div>
			</div>
		</Card>
	</div>
</div>

<SEO
	image="/og/kandidaat/{data.candidate.id}.png"
	username={data.candidate.id}
	firstname={data.candidate.firstname ?? data.candidate.initials}
	lastname={(data.candidate.prefix ? data.candidate.prefix + ' ' : '') + data.candidate.surname}
	gender={data.candidate.gender?.toLowerCase() ?? undefined}
/>
