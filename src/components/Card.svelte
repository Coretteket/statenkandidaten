<script lang="ts">
	export { className as class };
	let className: string = '';
</script>

<div
	class="flex flex-col gap-4 bg-white p-9 px-6 first-of-type:rounded-t-lg xs:rounded-lg xs:px-9 xs:first-of-type:rounded-lg md:p-12 {className}"
	{...$$restProps}
>
	<slot />
</div>
