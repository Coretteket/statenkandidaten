<script lang="ts">
	export let title: string | undefined = undefined;
	export let url: URL | undefined = undefined;
	export let description: string | undefined = undefined;
	export let image: string | undefined = undefined;
	export let imagewidth: number | undefined = undefined;
	export let imageheight: number | undefined = undefined;
	export let username: string | undefined = undefined;
	export let firstname: string | undefined = undefined;
	export let lastname: string | undefined = undefined;
	export let gender: string | undefined = undefined;
</script>

<svelte:head>
	{#if title}
		<title>{title}</title>
		<meta property="og:title" content={title} />
		<meta name="twitter:title" content={title} />
	{/if}

	{#if url}
		<meta property="og:type" content="website" />
		<meta property="og:url" content={url.href} />
		<meta property="twitter:url" content={url.href} />
		<meta property="twitter:domain" content={url.origin} />
	{/if}

	{#if description}
		<meta name="description" content={description} />
		<meta property="og:description" content={description} />
		<meta name="twitter:description" content={description} />
	{/if}

	{#if image}
		<meta property="og:image" content={image} />
		<meta name="twitter:image" content={image} />
		<meta name="twitter:card" content="summary_large_image" />
	{/if}

	{#if imagewidth && imageheight}
		<meta property="og:image:width" content={imagewidth.toString()} />
		<meta property="og:image:height" content={imageheight.toString()} />
	{/if}

	{#if username && firstname && lastname}
		<meta property="profile:username" content={username} />
		<meta property="profile:first_name" content={firstname} />
		<meta property="profile:last_name" content={lastname} />
	{/if}

	{#if gender}
		<meta property="profile:gender" content={gender} />
	{/if}
</svelte:head>
