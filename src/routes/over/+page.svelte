<script lang="ts">
	import Anchor from '~/components/Anchor.svelte';
	import Button from '~/components/Button.svelte';
	import Card from '~/components/Card.svelte';
	import Link from '~/components/Link.svelte';

	const support = () => {
		sessionStorage.setItem('statenkandidaten:support', 'true');
		window.dispatchEvent(new Event('statenkandidaten:support'));
	};
</script>

<Card title="Over Statenkandidaten">
	<div class="my-4 grid gap-12 text-gray-800 md:grid-cols-2">
		<div class="flex flex-col gap-3" id="waarom-statenkandidaten">
			<b class="text-lg font-medium">Waarom Statenkandidaten.nl?</b>
			<p>
				Elke partij heeft op meestal op hun eigen website de namen van hun kandidaten gepubliceerd,
				maar als je op zoek ben naar iemand die bij jou past, moet je zelf veel speuren. Daarom zijn
				ze hier allemaal verzameld, zodat je ze kan doorzoeken op naam, woonplaats, partij,
				geslacht, en meer. Zo kan je met meer vertrouwen je stem uitbrengen!
			</p>
		</div>

		<div class="flex flex-col gap-3">
			<b class="text-lg font-medium" id="waarom-kandidaat">Waarom een kandidaat kiezen?</b>
			<p>
				De kandidaat die jij kiest gaat jouw voor vier jaar vertegenwoordigen in de Provinciale
				Staten. Omdat er relatief weinig Statenleden zijn, kan één kandidaat – en dus jouw stem –
				een groot verschil maken. Misschien komt hij wel bij jou uit de buurt, en weet hij daarom
				beter wat er speelt. Of misschien weet zij juist veel over een onderwerp waar jij je zorgen
				over maakt.
			</p>
		</div>
	</div>
</Card>

<div class="grid gap-6 text-gray-800 md:grid-cols-2">
	<Card title="Steun dit project!" id="steun">
		<p>
			Deze website is volledig ontwikkeld door
			<Link href="https://qntn.io" external>één enthousiaste student</Link>, en dat was een flinke
			klus. Wil jij meer projecten zoals deze mogelijk maken? Dan zou ik een kleine donatie zeer op
			prijs stellen. Het kan snel en veilig via Tikkie!
		</p>

		<Button type={1} href="/steun" rel="noreferrer" target="_blank" on:click={support}>
			Doneer via Tikkie
		</Button>
	</Card>

	<Card title="Contact opnemen" id="contact">
		<p>
			Heb je een vraag, opmerking of suggestie? Stuur dan een mailtje naar
			<Link href="mailto:statenkandidaten@qntn.io" external>statenkandidaten@qntn.io</Link>. Mocht
			je een fout hebben gevonden, dan kan je ook een issue aanmaken
			<Link href="https://github.com/coretteket/statenkandidaten" external>op GitHub</Link>.
		</p>

		<Button type={3} href="mailto:statenkandidaten@qntn.io">Stuur een mailtje</Button>
	</Card>
</div>

<Card title="Over de verkiezingen">
	<div class="my-4 grid gap-12 text-gray-800 md:grid-cols-2">
		<div class="flex flex-col gap-3">
			<b class="text-lg font-medium" id="waarom-stemmen">Waarom moet ik stemmen?</b>
			<p>
				In de provincie worden besluiten genomen die invloed hebben op jouw dagelijks leven. Jouw
				stem op de Provinciale Staten bepaalt namelijk hoe we onze ruimte verdelen, hoe we zorgen
				voor natuur en water, hoe makkelijk we rond kunnen reizen én hoe we de economie in de regio
				kunnen verbeteren.
			</p>

			<div class="space-y-2">
				<Anchor
					href="https://nos.nl/video/2462437-ps23-een-spoedcursus-over-provinciale-staten-in-4-minuten"
				>
					Bekijk explainer op NOS.nl
				</Anchor>
				<Anchor
					href="https://www.rijksoverheid.nl/onderwerpen/verkiezingen/vraag-en-antwoord/provinciale-statenverkiezingen"
				/>
			</div>
		</div>
		<div class="flex flex-col gap-3">
			<b class="text-lg font-medium" id="hoe-stemmen">Hoe kan ik stemmen?</b>
			<p>
				Als het goed is heb je al een stempas ontvangen via de post. Neem deze en een geldig
				identiteitsbewijs op 15 maart mee naar een stembureau in jouw gemeente. Kleur in het
				stemhokje niet meer dan één rondje rood, vouw jouw stembiljet op, stop het in de stembus en
				je bent klaar!
			</p>

			<div class="space-y-2">
				<Anchor href="https://waarismijnstemlokaal.nl/">Vind een stembureau in de buurt</Anchor>
				<Anchor
					href="https://www.rijksoverheid.nl/onderwerpen/verkiezingen/vraag-en-antwoord/hoe-stemmen-bij-de-verkiezingen"
				/>
			</div>
		</div>
	</div>
</Card>

<Card title="Over de data">
	<div class="my-4 grid gap-12 text-gray-800 md:grid-cols-2">
		<div class="flex flex-col gap-3">
			<b class="text-lg font-medium" id="hoe-data">Hoe zijn de kandidaten verzameld?</b>
			<p>
				Voor elke verkiezing maken partijen een lijst met informatie over hun kandidaten. Deze lijst
				leveren ze in bij de Kiesraad, die deze lijsten vervolgens controleert. De lijsten voor de
				komende verkiezingen zijn inmiddels definitief, en gepubliceerd door de Kiesraad. Op basis
				van die informatie is deze website gemaakt.
			</p>

			<Anchor
				href="https://www.kiesraad.nl/actueel/nieuws/2023/02/14/kandidatenlijsten-provinciale-statenverkiezingen-definitief"
			/>
		</div>
		<div class="flex flex-col gap-3">
			<b class="text-lg font-medium" id="hoe-website">Hoe is deze website gemaakt?</b>
			<p>
				Dan toch even een technisch verhaal: de data is opgehaald uit XML-bestanden en omgezet naar
				een database. De website is gemaakt met
				<Link href="https://kit.svelte.dev" external>SvelteKit</Link>, een meta-framework voor
				Svelte, en wordt gehost op <Link href="https://vercel.com">Vercel</Link>. De website is
				volledig open-source, de code is te vinden op GitHub.
			</p>

			<Anchor href="https://github.com/coretteket/statenkandidaten">Bekijk code op GitHub</Anchor>
		</div>
	</div>
</Card>
