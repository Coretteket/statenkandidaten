<script lang="ts">
	import SEO from '~/components/SEO.svelte';
	import Logo from '~/components/Logo.svelte';
	import { Share, Help } from '~/components/icons';

	import '@fontsource/inter/variable.css';
	import '../app.css';

	import { page } from '$app/stores';
	import { dev } from '$app/environment';

	if (!dev) import('@vercel/analytics').then((e) => e.inject());

	$: pageTitle = $page.data.title ?? 'Statenkandidaten';
</script>

<SEO />

<header class="h-64 w-full bg-gradient-to-tr from-indigo-700 via-indigo-500 to-indigo-400">
	<nav
		class="relative mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-6 xs:py-8 sm:px-6"
	>
		<div class="flex flex-shrink-0 items-center gap-4">
			<a href="/" class="h-10 w-10 flex-shrink-0 text-indigo-50" aria-hidden="true">
				<Logo />
			</a>

			<a
				href="/"
				class="flex h-10 cursor-pointer appearance-none items-center justify-center gap-3 rounded-lg bg-indigo-50 bg-opacity-20 px-4 font-semibold text-indigo-50 transition tap:bg-indigo-100 tap:bg-opacity-30 max-sm:hidden"
			>
				Statenkandidaten
			</a>
		</div>

		<div class="flex flex-shrink-0 items-center gap-4">
			<a
				href="/"
				class="flex h-10 w-10 cursor-pointer appearance-none items-center justify-center gap-3 rounded-lg bg-indigo-50 bg-opacity-20 font-medium text-indigo-50 transition tap:bg-indigo-100 tap:bg-opacity-30"
			>
				<span class="sr-only">Over dit project</span>
				<Help class="h-6 w-6" aria-hidden={true} />
			</a>
			<button
				on:click={() => {
					if (navigator.share)
						navigator.share({
							title: 'Statenkandidaten',
							text: 'Statenkandidaten',
							url: $page.url.toString(),
						});
					else navigator.clipboard.writeText($page.url.toString());
				}}
				class="flex h-10 cursor-pointer appearance-none items-center justify-center gap-3 rounded-lg bg-indigo-50 bg-opacity-20 px-3 font-semibold text-indigo-50 transition tap:bg-indigo-100 tap:bg-opacity-30"
			>
				<Share class="h-5 w-5" aria-hidden={true} />
				<span>Delen</span>
			</button>
		</div>
	</nav>
</header>

<main class="mx-auto -mt-52 grid max-w-5xl gap-6 py-10 pb-14 xs:-mt-48 xs:px-4 sm:px-6">
	<slot />
</main>

<svelte:head>
	<noscript>
		<style>
			.js-only {
				display: none !important;
			}
			.no-js {
				display: inherit !important;
			}
		</style>
	</noscript>
</svelte:head>
