<script lang="ts">
	import Content, { getContent } from '$lib/index';

	console.log('index', getContent('key'));
</script>

<Content id="default" />
