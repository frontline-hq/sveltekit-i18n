<script lang="ts">
	import ReactWrapper from '@frontline-hq/react-in-svelte';
	import htm from 'htm';
	import { h, type VNode } from 'preact';
	import { getContent } from './index';
	export let id: string;

	const html = htm.bind(h);

	function vN(id: string) {
		return html`<${getContent(id)} />` as VNode;
	}
</script>

<ReactWrapper vNode={vN(id)} />
