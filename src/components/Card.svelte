<script lang="ts">
	export let title: string | undefined = undefined;
	export { style as class };
	let style: string = '';
</script>

<div
	class="flex flex-col gap-4 bg-white p-9 px-6 xs:rounded-lg xs:px-9 md:p-12 {style}"
	{...$$restProps}
>
	{#if title}
		<h2 class="text-2xl font-semibold text-gray-900">{title}</h2>
	{/if}
	<slot />
</div>
