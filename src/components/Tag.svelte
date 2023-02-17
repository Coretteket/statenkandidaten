<script lang="ts">
	export let icon: ConstructorOfATypedSvelteComponent;
	export let content: string | null;
</script>

<span
	class="flex items-center gap-2 rounded-lg bg-indigo-100 bg-opacity-75 px-3 py-1 font-medium text-indigo-900/90 transition hover:bg-opacity-100"
	title={content}
>
	<svelte:component this={icon} class="w-4.5 h-4.5 text-indigo-800/90" />
	<span class="max-w-[8rem] truncate md:max-w-[10rem]">
		{content}
	</span>
</span>
