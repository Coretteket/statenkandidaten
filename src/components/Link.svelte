<script lang="ts">
	export let href: string;
	export let external = false;
</script>

<a
	{href}
	class="font-medium text-indigo-600 hover:underline"
	target={external ? '_blank' : null}
	rel={external ? 'noreferrer' : null}
>
	<slot />
</a>
