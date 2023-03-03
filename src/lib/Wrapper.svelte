<script lang="ts">
	import { onMount } from 'svelte';
	import { redirect } from './index';

	onMount(() => {
		redirect();
	});
</script>

<slot />
