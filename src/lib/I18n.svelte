<script lang="ts">
	import ReactWrapper from '@frontline-hq/react-in-svelte';
	import htm from 'htm/mini';
	import { h, type VNode } from 'preact';
	import type { i18n } from '$lib/i18n';

	export let i18n: i18n;
	export let id: string;
	const html = htm.bind(h);

	const vNode = (content: any) => {
		return html`<${content} />` as VNode;
	};
</script>

<ReactWrapper vNode={vNode($i18n.get(id))} />
