<script lang="ts">
	import { Chevron } from './icons';

	export let open = false;

	export let title: string;
	export let selected: string | Record<string, boolean> | undefined = undefined;

	const formatNumber = (n: number) => (n > 0 ? `${n} filter${n !== 1 ? 's' : ''}` : undefined);
	$: text = typeof selected === 'object' ? formatNumber(Object.keys(selected).length) : selected;
</script>

<details {open} class="py-1">
	<summary class="my-2 flex cursor-pointer items-center justify-between font-medium">
		<div class="flex gap-1.5 [&:nth-child(2)]:text-indigo-500">
			{title}
			{#if text && text.length > 0}
				<span class="font-semibold text-indigo-500">({text})</span>
			{/if}
		</div>
		<Chevron class="h-6 w-6 text-gray-700 [[open]_&]:rotate-90" aria-hidden={true} />
	</summary>

	<div class="mt-3 mb-4 space-y-4">
		<slot />
	</div>
</details>

<hr class="border-gray-200" aria-hidden={true} />
