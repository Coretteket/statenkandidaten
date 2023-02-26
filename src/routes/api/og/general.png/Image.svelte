<script lang="ts">
	import Button from '~/components/Button.svelte';
</script>

<div class="flex h-full w-full flex-col justify-between bg-white">
	<div class="flex w-full px-20 pt-16">
		<div class="flex items-center text-gray-900">
			<img src="http://statenkandidaten.nl/favicon.png" width="48" height="48" alt="" />
			<h1 class="ml-6 text-3xl font-bold text-gray-800">Statenkandidaten</h1>
		</div>
	</div>
	<div class="-mt-10 flex flex-col px-20">
		<h1 class="mb-4 text-[4rem] font-bold text-gray-900">
			Op 15 maart mogen we weer stemmen, maar op wie eigenlijk?
		</h1>
		<h1 class="text-5xl font-normal text-gray-700">Vind de kandidaat die écht bij jou past!</h1>
		<div class="mt-10 flex justify-start">
			<div class="flex items-center rounded-xl bg-indigo-100 px-7 py-4.5 text-[2.5rem] font-semibold text-indigo-900/90">
				Zoek in jouw provincie
			</div>
		</div>
	</div>
	<div class="flex h-5 w-full bg-indigo-600" />
</div>
