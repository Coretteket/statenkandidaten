<script lang="ts">
	export let type: keyof typeof styles = 1;
	export let href: string | undefined;
	export { className as class };
	let className: string = '';

	const styles = {
		1: 'bg-indigo-600 py-3 font-bold text-white tap:bg-indigo-700',
		2: 'bg-indigo-200 py-3 font-bold text-indigo-900 bg-opacity-80 tap:bg-indigo-300 tap:bg-opacity-75',
		3: 'border-4 border-gray-100 py-2 font-semibold text-gray-700 tap:bg-gray-100',
	};

	$: style = `rounded-lg flex px-6 w-full sm:w-fit justify-center gap-3 items-center transition disabled:opacity-50 ${styles[type]} ${className}`;
</script>

{#if typeof href === 'string'}
	<a {href} class={style} {...$$restProps}><slot /></a>
{:else}
	<button on:click class={style} {...$$restProps}><slot /></button>
{/if}
