<script lang="ts">
	import i18n from 'virtual:i18n';
	import Content from '$lib/I18n.svelte';
	import LangRouter from '$lib/LangRouter.svelte';

	$: console.log('lang', $i18n.lang);
	$: console.log($i18n.get('layout.key'));
</script>

<LangRouter>
	<Content id="layout.default" />
	<slot />
</LangRouter>
