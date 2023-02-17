<script lang="ts">
	import Arrow from '~icons/mdi/arrow-top-right';

	export let href: string;
	export let newtab = true;
	export let icon = 'h-5 w-5';
	export { style as class };
	let style = '';

	const getDomain = (url: string) => new URL(url).hostname.split('.').slice(-2).join('.');
</script>

<a
	class="flex items-start gap-2 font-medium text-indigo-600 hover:underline {style}"
	target={newtab ? '_blank' : null}
	rel={newtab ? 'noreferrer noopener' : null}
	{...$$restProps}
	{href}
>
	<Arrow class="{icon} mt-[3px] inline" />
	<slot>
		Lees meer op {getDomain(href)}
	</slot>
</a>
