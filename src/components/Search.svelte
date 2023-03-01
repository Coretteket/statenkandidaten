<script lang="ts">
	export let name: string | undefined = undefined;
	export let value = '';
	export let placeholder: string;
	export { className as class };
	let className = '';
</script>

<input
	{name}
	bind:value
	on:input
	{placeholder}
	class="form-input w-full flex-1 rounded-md border-gray-300 px-4 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 {className}"
/>
