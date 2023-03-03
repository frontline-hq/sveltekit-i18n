<script lang="ts">
	import Content, { getContent, getLang } from '$lib/index';

	console.log('lang', getLang());
	console.log(getContent('layout.key'));
</script>

<div>
	<Content id="layout.default" />
	<slot />
</div>
