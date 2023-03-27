<script lang="ts">
	import i18n from 'virtual:i18n';
	import Content from '@frontline-hq/sveltekit-i18n/I18n.svelte';
	import LangRouter from '@frontline-hq/sveltekit-i18n/LangRouter.svelte';

	$: console.log($i18n.get('layout.key'));
</script>

<LangRouter {i18n}>
	<Content id="layout.default" {i18n} />
	<slot />
</LangRouter>
