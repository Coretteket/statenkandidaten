<script lang="ts">
	import Card from '~/components/Card.svelte';
	import type { PageData, Snapshot } from './$types';

	let comment = '';

	export const snapshot: Snapshot = {
		capture: () => {
			console.log(comment);
			return comment;
		},
		restore: (v: string) => {
			console.log(v);
			comment = v;
		},
	};
</script>

<Card>
	<input type="text" class="form-input" bind:value={comment} />
	{comment}
	<a href="/">Home</a>
</Card>
