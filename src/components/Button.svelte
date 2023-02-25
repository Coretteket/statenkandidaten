<script lang="ts">
	export let type: keyof typeof styles = 1;
	export let href = '';
	export let fallback = '';
	export { className as class };
	let className: string = '';

	const styles = {
		1: 'bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700',
		2: 'bg-indigo-200 py-3 font-bold text-indigo-900 bg-opacity-80 hover:bg-indigo-300 hover:bg-opacity-75',
		3: 'border-2 border-gray-200 py-2.5 font-semibold text-gray-800 hover:bg-gray-100 hover:border-gray-100',
	};

	$: style = `rounded-md flex px-6 w-full sm:w-fit justify-center gap-2.5 items-center transition disabled:opacity-50 ${styles[type]} ${className}`;
</script>

{#if href.length > 0}
	<a {href} class={style} {...$$restProps}><slot /></a>
{:else}
	<button
		on:click|preventDefault
		class={style}
		class:js-only={fallback.length > 0}
		{...$$restProps}
	>
		<slot />
	</button>
	{#if fallback.length > 0}
		<a href={fallback} class="no-js {style}" {...$$restProps}><slot /></a>
	{/if}
{/if}
