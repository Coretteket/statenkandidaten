<script lang="ts">
	import Help from '~icons/mdi/help-circle-outline';
	import Close from '~icons/mdi/close-circle-outline';
	import { onMount } from 'svelte';

	export let hideButton = false;
	export let title: string;

	$: buttonHidden = !$$slots.details || hideButton;
	const details = buttonHidden ? 'div' : 'details';
	const summary = buttonHidden ? 'div' : 'summary';
</script>

<hr />
<svelte:element this={details} class="group">
	<svelte:element
		this={summary}
		class="grid grid-cols-[3fr_5fr_2rem] text-lg"
		class:cursor-pointer={!buttonHidden}
	>
		<div class="col-start-1 col-end-3 sm:col-end-2" class:max-sm:col-end-4={buttonHidden}>
			<h2 class="font-medium text-gray-800">{title}</h2>
		</div>
		<div
			class="col-start-1 col-end-4 max-sm:row-start-2 sm:col-start-2 sm:col-end-3"
			class:sm:col-end-4={buttonHidden}
		>
			<slot />
		</div>
		<div
			class="col-start-3 col-end-4 my-1 flex justify-end text-gray-400 transition group-open:text-gray-700 group-hover:text-gray-700"
			class:hidden={buttonHidden}
		>
			<Help class="group-open:hidden" aria-hidden={true} />
			<Close class="hidden group-open:block" aria-hidden={true} />
			<span class="sr-only">Meer informatie</span>
		</div>
	</svelte:element>
	<div class="mt-3 leading-5 text-gray-700">
		<slot name="details" />
	</div>
</svelte:element>
<hr class="hidden last-of-type:block" />
