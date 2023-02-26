<script lang="ts">
	import { City, Party } from '~/components/icons';

	export let name: string;
	export let party: string;
	export let position: number;
	export let provinces: string[];
</script>

<div class="flex h-full w-full flex-col justify-between bg-white">
	<div class="flex w-full px-20 pt-16">
		<div class="flex items-center text-gray-900">
			<img src="http://statenkandidaten.nl/favicon.png" width="48" height="48" alt="" />
			<h1 class="ml-6 text-3xl font-bold text-gray-800">Statenkandidaten</h1>
		</div>
	</div>
	<div class="-mt-12 flex flex-col px-20">
		<h2 class="mb-6 text-5xl font-normal text-gray-600">Op 15 maart kan je stemmen op</h2>
		<h1 class="text-[5rem] font-normal text-gray-800">
			{position}.<span class="flex ml-5 font-extrabold text-gray-900">{name}</span>
		</h1>
		<div class="mt-6 flex">
			<div
				class="mr-6 flex items-center rounded-xl bg-indigo-100 px-6 py-3 text-[2.5rem] font-semibold text-indigo-900/90"
			>
				<Party class="mr-6" />
				{party}
			</div>
			<div
				class="mr-6 flex items-center rounded-xl bg-indigo-100 px-6 py-3 text-[2.5rem] font-semibold text-indigo-900/90"
			>
				<City class="mr-6" />
				{provinces[0]}
			</div>
			{#if provinces.length > 1}
				<div
					class="mr-6 flex items-center rounded-xl bg-indigo-100 px-4 py-3 text-[2.5rem] font-bold text-indigo-900/90"
				>
					+{provinces.length - 1}
				</div>
			{/if}
		</div>
	</div>
	<div class="flex h-5 w-full bg-indigo-600" />
</div>
