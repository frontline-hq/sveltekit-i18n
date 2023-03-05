<script lang="ts">
	import ReactWrapper from '@frontline-hq/react-in-svelte';
	import htm from 'htm/mini';
	import { h, type VNode } from 'preact';
	import { i18n } from './index';
	export let id: string;

	const html = htm.bind(h);

	const vNode = (content: any) => {
		return html`<${content} />` as VNode;
	};
</script>

<ReactWrapper vNode={vNode($i18n.get(id))} />
