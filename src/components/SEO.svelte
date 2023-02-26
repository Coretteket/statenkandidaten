<script lang="ts">
	import { page } from '$app/stores';
	import { mergeMeta } from '~/lib/meta';

	$: meta = mergeMeta($page.url, $page.data.meta);
	$: origin = $page.url.origin;
</script>

<svelte:head>
	<title>{meta.title}</title>
	<meta property="og:title" content={meta['meta:title'] ?? meta.title} />
	<meta name="twitter:title" content={meta['meta:title'] ?? meta.title} />

	<meta property="og:type" content="website" />
	<meta property="og:url" content={meta.url.href} />
	<meta property="twitter:url" content={meta.url.href} />
	<meta property="twitter:domain" content={origin} />

	<meta name="description" content={meta.description} />
	<meta property="og:description" content={meta.description} />
	<meta name="twitter:description" content={meta.description} />

	<meta name="image" property="og:image" content="{origin}{meta.image}" />
	<meta name="twitter:image" content="{origin}{meta.image}" />
	<meta name="twitter:card" content="summary_large_image" />

	<meta property="og:image:width" content={meta['image:width']} />
	<meta property="og:image:height" content={meta['image:height']} />

	{#if meta.username && meta.firstname && meta.lastname}
		<meta property="profile:username" content={meta.username} />
		<meta property="profile:first_name" content={meta.firstname} />
		<meta property="profile:last_name" content={meta.lastname} />
	{/if}

	{#if meta.gender}
		<meta property="profile:gender" content={meta.gender} />
	{/if}
</svelte:head>
