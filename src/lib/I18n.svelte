<script context="module" lang="ts">
	import lodash from 'lodash';
	import htm from 'htm';
	import { h, type VNode } from 'preact';
	import { page } from '$app/stores';

	const { get } = lodash;
	const html = htm.bind(h);

	// Will be replaced by dynamic language getter
	export async function init({
		lang,
		pathname,
		pathDel = '_',
		defaultLang = 'en',
		layout = true,
		page
	}: {
		lang: string | undefined;
		pathname: string;
		pathDel?: string;
		defaultLang?: string;
		layout?: boolean;
		page?: boolean;
	}) {
		function stripEnd(s: string) {
			return s.split('/').slice(0, -1).join('/');
		}
		function stripBegin(s: string, del: string) {
			return s.split(del).slice(1).join(del);
		}
		const strippedLangPath = pathname.replace(`/${lang}`, '') + '/page';
		const strippedPath = stripEnd(strippedLangPath);
		const l = lang || defaultLang;
		const pageKey = (l + strippedLangPath).replace('//', '/').replaceAll('/', pathDel);
		const allContents: Record<string, unknown> = await import('virtual:merge/contents/**/*.mdx');
		const pageContents = allContents[pageKey];
		const contents: Record<string, unknown> = {};
		if (layout) {
			Object.entries(allContents)
				.filter(
					(e) =>
						e[0].startsWith(l + pathDel) &&
						e[0].endsWith(pathDel + 'layout') &&
						strippedPath.includes(stripEnd(e[0]))
				)
				.forEach((e) => {
					contents[stripBegin(e[0], pathDel)] = e[1];
				});
		}
		if (page || page === undefined) {
			contents.page = pageContents;
		}
		return contents;
	}
	export function getContent(id: string) {
		const layout = id.includes('_layout.') || id.startsWith('layout.');
		let content;
		const unsub = page.subscribe((v) => (content = v.data.contents));
		unsub();
		return get(content, layout ? id : 'page.' + id);
	}
	function vN(id: string) {
		return html`<${getContent(id)} />` as VNode;
	}
</script>

<script lang="ts">
	import ReactWrapper from '@frontline-hq/react-in-svelte';
	export let id: string;
</script>

<ReactWrapper vNode={vN(id)} />
