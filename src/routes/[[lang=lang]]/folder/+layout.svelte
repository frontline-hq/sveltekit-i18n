<script lang="ts">
	import Content, { getContent } from '$lib/I18n.svelte';
	console.log(getContent('folder_layout.key'));
</script>

<div>
	<Content id="folder_layout.default" />
	<slot />
</div>
