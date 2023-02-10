<script lang="ts">
	import Content, { getContent } from '$lib/index';
	console.log(getContent('layout.key'));
</script>

<div>
	<Content id="layout.default" />
	<slot />
</div>
