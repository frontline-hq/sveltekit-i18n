<script lang="ts">
	import Content, { i18n, LangRouter } from '$lib/index';

	$: console.log('lang', $i18n.lang);
	$: console.log($i18n.get('layout.key'));
</script>

<LangRouter>
	<Content id="layout.default" />
	<slot />
</LangRouter>
