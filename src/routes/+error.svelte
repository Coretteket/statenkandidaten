<script lang="ts">
	import { page } from '$app/stores';
	import Button from '~/components/Button.svelte';
	import Card from '~/components/Card.svelte';

	$: error = $page.error!.message;
	$: title = error === 'Not Found' ? 'Pagina niet gevonden' : error;
</script>

<Card {title}>
	<p>
		Er is iets misgegaan met het laden van deze pagina. Stuur vooral een mailtje naar
		<a href="mailto:statenkandidaten@qntn.io" class="font-medium text-indigo-600 hover:underline"
			>statenkandidaten@qntn.io</a
		>
		om deze fout te melden. Voor nu kan je terug naar de homepagina, of meer lezen over Statenkandidaten.
	</p>

	<div class="flex flex-wrap gap-4">
		<Button href="/">Terug naar home</Button>
		<Button href="/over" type={3}>Over Statenkandidaten</Button>
	</div>
</Card>
