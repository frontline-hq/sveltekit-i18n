<script lang="ts">
	import { onMount } from 'svelte';
	import type { i18n } from '$lib/i18n';

	export let i18n: i18n;

	onMount(() => {
		$i18n.redirect();
	});
</script>

<slot />
