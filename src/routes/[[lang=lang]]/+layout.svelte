<script lang="ts">
	import Content, { getContent } from '$lib/I18n.svelte';
	console.log(getContent('layout.key'));
</script>

<div>
	<Content id="layout.default" />
	<slot />
</div>
