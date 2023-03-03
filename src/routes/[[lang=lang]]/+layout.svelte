<script lang="ts">
	import Content, { getContent, getLang, LangRouter } from '$lib/index';

	console.log('lang', getLang());
	console.log(getContent('layout.key'));
</script>

<LangRouter>
	<Content id="layout.default" />
	<slot />
</LangRouter>
