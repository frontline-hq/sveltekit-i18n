<script lang="ts">
	import { onMount } from 'svelte';
	import { i18n } from './index';

	onMount(() => {
		$i18n.redirect();
	});
</script>

<slot />
