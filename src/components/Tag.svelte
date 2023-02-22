<script lang="ts">
	export let icon: ConstructorOfATypedSvelteComponent;
	export let content: string | null;
	export let href: string | null = null;
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	class="flex w-min items-center gap-2 rounded-lg bg-indigo-100 bg-opacity-75 px-3 py-1 font-medium text-indigo-900/90 transition"
	title={content}
	{href}
>
	<svelte:component this={icon} class="w-4.5 h-4.5 text-indigo-800/90" />
	<span class="max-w-[8rem] truncate md:max-w-[10rem]">
		{content}
	</span>
</svelte:element>
