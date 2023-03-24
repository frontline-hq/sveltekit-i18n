<script lang="ts">
	import i18n from 'virtual:i18n';
	import Content from '@frontline-hq/sveltekit-i18n/I18n.svelte';
	console.log('index', $i18n.get('key'));
</script>

<Content id="default" {i18n} />
