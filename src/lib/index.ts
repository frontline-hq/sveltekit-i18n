// Reexport your entry components here
import { page } from '$app/stores';
import lodash from 'lodash';
export { default } from './I18n.svelte';

const { get } = lodash;

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
	const contents: Record<string, unknown> = {};
	try {
		const allContents: Record<string, unknown> = await import('virtual:merge/contents/**/*.mdx');
		const pageContents = allContents[pageKey];
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
	} catch (error) {
		console.error("Couldn't import content .mdx files, error:");
		console.error(error);
	}
	return contents;
}

export function getContent(id: string, pathDel = '_', defaultLang = 'en') {
	const layout = id.includes('_layout.') || id.startsWith('layout.');
	let content;
	let lang = '';
	let route = '';
	const unsub = page.subscribe((v) => {
		lang = v.params.lang || defaultLang;
		route = v.route.id || '';
		content = v.data.contents;
	});
	unsub();
	const result = get(content, layout ? id : 'page.' + id);
	if (!result) {
		if (layout) {
			const filePath = `.../contents/${lang}/${id.split('.')[0].replace(pathDel, '/')}`;
			const key = id.split('.').slice(1).join('.');
			console.error(
				`couldn't getContent for '${id}'.\n\nDoes the path '${filePath}' point to an existing file?\n\nDoes the key '${key}' exist in the file '${filePath}'?`
			);
		} else {
			const filePath = `.../contents${route.replace('[[lang=lang]]', lang)}/page`;
			const key = id;
			console.error(
				`couldn't getContent for '${id}'.\n\nDoes the path '${filePath}' point to an existing file?\n\nDoes the key '${key}' exist in the file '${filePath}'?`
			);
		}
	}
	return result;
}