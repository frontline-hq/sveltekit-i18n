// Reexport your entry components here
export { default } from './I18n.svelte';
export { default as LangRouter } from './Wrapper.svelte';
export { default as rollupI18N } from './rollup';
import config from 'virtual:i18n-config';
import type { ParamMatcher } from '@sveltejs/kit';

export async function init({
	lang,
	pathname,
	pathDel = '_',
	layout = true,
	page
}: {
	lang: string | undefined;
	pathname: string;
	pathDel?: string;
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
	const l = lang || config.defaultLang;
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

export function setLangPref(lang: string) {
	if (window) {
		window.localStorage.setItem('i18n-lang-preference', lang);
	} else throw new Error('window is not defined.');
}

export const match = ((param) => {
	const locales = config.langs;
	return locales.includes(param);
}) satisfies ParamMatcher;

export { i18n, getLangPref } from 'virtual:i18n';
