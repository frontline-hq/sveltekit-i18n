<script lang="ts">
	import { onMount } from 'svelte';
	import i18n from 'virtual:i18n';

	onMount(() => {
		$i18n.redirect();
	});
</script>

<slot />
