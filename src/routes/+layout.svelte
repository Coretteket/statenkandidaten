<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';

	import '@fontsource/inter/variable.css';
	import { Help, Share } from '~/components/icons';
	import '../app.css';

	// export let data: import('./$types').LayoutData;

	// prevent weird scroll behavior on back/forward navigation
	afterNavigate((nav) => nav.type == 'popstate' && window.scrollTo(0, 0));
</script>

<svelte:head>
	<title>Provinciale Staten '23</title>
</svelte:head>

<header class="h-64 w-full bg-gradient-to-tr from-indigo-700 via-indigo-500 to-indigo-400">
	<nav class="relative mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-8 sm:px-6">
		<a href="/" class="h-10 w-10 flex-shrink-0 text-indigo-50">
			<span class="sr-only">Provinciale Staten '23</span>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 56.7 56.7"
				width={40}
				height={40}
				aria-hidden={true}
				fill="currentColor"
			>
				<polygon points="38.1 19.44 31.2 12.53 21.51 22.19 28.44 29.1 38.1 19.44" />
				<path
					d="M44.69,0H12A12,12,0,0,0,0,12V44.69a12,12,0,0,0,12,12H44.69a12,12,0,0,0,12-12V12A12,12,0,0,0,44.69,0ZM17.39,20.83,29.83,8.39l0,0a1.91,1.91,0,0,1,2.69.06l9.66,9.66h0a2,2,0,0,1,0,2.75L29.81,33.2a1.88,1.88,0,0,1-2.75,0l-9.67-9.62h0A1.94,1.94,0,0,1,17.39,20.83ZM45.91,43A3.91,3.91,0,0,1,42,46.87H14.68A3.91,3.91,0,0,1,10.78,43V35.15l5.85-5.85h1.62l3.91,3.9h-4l-3.48,3.91H42L38.55,33.2H34.83l3.9-3.9h1.33l5.85,5.85Z"
				/>
			</svg>
		</a>

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
							title: "Provinciale Staten '23",
							text: "Provinciale Staten '23",
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

<main class="mx-auto -mt-48 grid max-w-5xl gap-6 py-10 pb-16 xs:px-4 sm:px-6">
	<slot />
</main>
