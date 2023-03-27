<script lang="ts">
	import i18n from 'virtual:i18n';
	import Content from '@frontline-hq/sveltekit-i18n/I18n.svelte';
	console.log($i18n.get('folder_$dynamic_folder$_layout.key'));
</script>

<div>
	<Content id="folder_$dynamic_folder$_layout.default" {i18n} />
	<slot />
</div>
