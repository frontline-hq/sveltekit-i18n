<script lang="ts">
	import Content, { i18n } from '$lib/index';
	console.log($i18n.get('folder_layout.key'));
</script>

<div>
	<Content id="folder_layout.default" />
	<slot />
</div>
