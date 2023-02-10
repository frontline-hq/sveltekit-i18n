<script lang="ts">
	import Content, { getContent } from '$lib/I18n.svelte';

	console.log('index', getContent('key'));
</script>

<Content id="default" />
