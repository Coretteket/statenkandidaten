<script lang="ts">
	import { Help, CloseCircle } from '~/components/icons';

	export let hideButton = false;
	export let title: string;

	$: openable = $$slots.details && !hideButton;
	$: details = openable ? 'details' : 'div';
	$: summary = openable ? 'summary' : 'div';
</script>

<svelte:element this={details} class="border-b-2 border-gray-100 first:border-t-2">
	<svelte:element
		this={summary}
		class="group grid grid-cols-[3fr_5fr_2rem] py-4 text-lg"
		class:cursor-pointer={openable}
	>
		<div class="col-start-1 col-end-3 sm:col-end-2" class:max-sm:col-end-4={!openable}>
			<h2 class="font-medium text-gray-800">{title}</h2>
		</div>
		<div
			class="col-start-1 col-end-4 max-sm:row-start-2 sm:col-start-2 sm:col-end-3"
			class:sm:col-end-4={!openable}
		>
			<slot />
		</div>
		{#if openable}
			<div
				class="col-start-3 col-end-4 my-1 flex justify-end text-gray-400 transition group-open:text-gray-700 group-hover:text-gray-700"
			>
				<Help class="group-open:hidden" aria-hidden={true} />
				<CloseCircle class="hidden group-open:block" aria-hidden={true} />
				<span class="sr-only">Meer informatie</span>
			</div>
		{/if}
	</svelte:element>
	{#if openable}
		<div class="-mt-2 mb-4 leading-5 text-gray-700">
			<slot name="details" />
		</div>
	{/if}
</svelte:element>
