<script lang="ts">
	import SEO from '~/components/SEO.svelte';
	import Logo from '~/components/Logo.svelte';
	import { Share, Help, PartyPopper } from '~/components/icons';

	import '@fontsource/inter/variable.css';
	import '../app.css';

	import { page } from '$app/stores';
	import { browser, dev } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import { easterEgg } from '~/lib/utils';
	import { defaultMeta } from '~/lib/meta';

	if (!dev) import('@vercel/analytics').then((e) => e.inject());

	onMount(easterEgg);

	let support = true;
	const setSupport = () => (support = false);
	onMount(() => {
		if (!browser) return;
		if (sessionStorage.getItem('statenkandidaten:support') === 'true') setSupport();
		window.addEventListener('statenkandidaten:support', setSupport);
	});
	onDestroy(() => browser && window.removeEventListener('statenkandidaten:support', setSupport));

	let copied = false;
	const share = () => {
		if (navigator.share)
			navigator.share({
				title: $page.data.meta.title,
				text: defaultMeta($page.url).description,
				url: $page.url.toString(),
			});
		else {
			navigator.clipboard.writeText($page.url.toString());
			copied = true;
			setTimeout(() => (copied = false), 3000);
		}
	};
</script>

<SEO />

<header class="h-64 w-full bg-gradient-to-tr from-indigo-700 via-indigo-500 to-indigo-400">
	<nav
		class="relative mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-6 xs:py-8 sm:px-6"
	>
		<div class="flex flex-shrink-0 items-center gap-4">
			<a href="/" class="h-10 w-10 flex-shrink-0 text-indigo-50" aria-label="Home">
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
				href="/over#steun"
				class="flex h-10 cursor-pointer appearance-none items-center justify-center gap-3 rounded-lg bg-indigo-50 bg-opacity-20 px-3 font-semibold text-indigo-50 transition tap:bg-indigo-100 tap:bg-opacity-30"
				class:support-button={support}
				title="Steun dit onafhankelijk project"
			>
				<PartyPopper class="h-5 w-5" aria-hidden={true} />
				<span>Steun</span>
			</a>
			<button
				on:click={share}
				class="js-only flex h-10 cursor-pointer appearance-none items-center justify-center gap-3 rounded-lg bg-indigo-50 bg-opacity-20 px-3 font-semibold text-indigo-50 transition tap:bg-indigo-100 tap:bg-opacity-30"
				title="Deel deze pagina"
			>
				{#if copied}
					Gekopieerd
				{:else}
					<Share class="h-5 w-5" aria-hidden={true} />
					<span>Delen</span>
				{/if}
			</button>
		</div>
	</nav>
</header>

<main class="mx-auto -mt-52 grid max-w-5xl gap-6 py-10 pb-14 xs:-mt-48 xs:px-4 sm:px-6">
	<slot />

	<hr class="mt-4 mb-2" aria-hidden={true} />
	<footer
		class="flex gap-y-2 gap-x-8 px-6 max-lg:pb-16 font-medium text-gray-600 max-md:flex-col xs:px-9 md:justify-center md:px-12 [&_a]:font-semibold [&_a]:text-gray-700 [&_a]:transition hover:[&_a]:text-indigo-600 hover:[&_a]:underline"
	>
		<span>
			Ontwikkeld door <a href="https://qntn.io" target="_blank" rel="noreferrer">Quinten Coret</a>.
		</span>
		<span>
			Open source op
			<a href="https://github.com/coretteket/statenkandidaten" target="_blank" rel="noreferrer">
				GitHub</a
			>.
		</span>
		<span>
			Steun dit project met <a href="/steun" target="_blank" rel="noreferrer">Tikkie</a>.
		</span>
	</footer>
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

<style>
	.support-button {
		background-image: linear-gradient(-70deg, transparent 30%, #eef2ff4e 50%, transparent 70%);
		background-repeat: no-repeat;
		background-size: 200% 100%;
		background-position: -100%;
		animation: 20s move-bg linear infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		.support-button {
			animation: none;
		}
	}

	@keyframes move-bg {
		0% {
			background-position: 100% 0;
		}
		4%,
		100% {
			background-position: -100% 0;
		}
	}
</style>
