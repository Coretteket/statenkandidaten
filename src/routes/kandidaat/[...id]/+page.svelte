<script lang="ts">
	import Anchor from '~/components/Anchor.svelte';
	import Card from '~/components/Card.svelte';
	import Row from './Row.svelte';

	import type { Gender } from '@prisma/client';
	import { arrayUnique, switcher } from '~/scripts/utils';
	import Button from '~/components/Button.svelte';
	import { goto } from '$app/navigation';

	export let data: import('./$types').PageServerData;

	const getGender = (gender: Gender | null) =>
		switcher(gender, {
			MALE: 'Man',
			FEMALE: 'Vrouw',
			OTHER: 'Anders',
			default: 'Onbekend',
		});

	const getFullName = ({ firstname, initials, prefix, surname }: typeof data.candidate) =>
		[firstname ?? initials, prefix, surname].filter(Boolean).join(' ');

	const getOfficialName = ({ firstname, initials, prefix, surname }: typeof data.candidate) =>
		`${[prefix, surname].filter(Boolean).join(' ')}, ${initials}` +
		(firstname ? ` (${firstname})` : '');

	$: fullName = getFullName(data.candidate);
	$: officialName = getOfficialName(data.candidate);

	$: partyLinks = arrayUnique(data.lists.flatMap((list) => list.links.party));
	$: provinceLinks = data.lists.map((list) => list.links.province);
	$: links = partyLinks.concat(provinceLinks);

	const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-');
	const fallbackURL = `/provincie/${slugify(data.lists[0].province)}`;

	const goBack = () => {
		const entries = window.navigation?.entries();
		const previous = entries?.at(-1);
		if (previous) window.navigation?.back();
		else goto(fallbackURL);
	};
</script>

<div class="grid gap-6 lg:grid-cols-content-sidebar">
	<div class="space-y-6">
		<Card>
			<h1 class="font-gray-900 mb-2 text-[1.7rem] font-bold leading-[1.25]">
				{fullName}
			</h1>

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
							woont, kijk dus goed op je stembiljet!
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
					Het geslacht van deze kandidaat is niet bekend. De partij van deze kandidaat heeft ervoor
					gekozen om dit niet te publiceren.
				</div>
			</Row>

			<Button type={3} on:click={goBack} fallback={fallbackURL} class="mt-3"
				>Terug naar overzicht</Button
			>
		</Card>

		<Card>
			<div class="space-y-4 md:-my-2">
				<h2 class="text-xl font-semibold text-gray-800">Meer informatie</h2>

				<div class="space-y-2 text-lg">
					{#each links as href}
						<Anchor {href} />
					{/each}
					<Anchor href="https://google.nl/search?q={fullName}">Zoek kandidaat op Google</Anchor>
				</div>
			</div>
		</Card>
	</div>

	<div>
		<Card>
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
	</div>
</div>