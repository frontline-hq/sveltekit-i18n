// Reexport your entry components here
import { page } from '$app/stores';
import lodash from 'lodash';
export { default } from './I18n.svelte';
export { default as LangRouter } from './Wrapper.svelte';
export { default as rollupI18N } from './rollup';
import config from 'virtual:i18n-config';
import type { ParamMatcher } from '@sveltejs/kit';
import { derived } from 'svelte/store';
const { get } = lodash;

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

export const i18n = derived(page, ($page) => {
	const lang = $page.params.lang || config.defaultLang;
	const route = $page.route.id || '';
	return {
		get: function (id: string, pathDel = '_') {
			const layout = id.includes('_layout.') || id.startsWith('layout.');
			const result = get($page.data.contents, layout ? id : 'page.' + id);
			if (!result) {
				if (layout) {
					const filePath = `.../contents/${lang}/${id.split('.')[0].replace(pathDel, '/')}`;
					const key = id.split('.').slice(1).join('.');
					console.error(
						`couldn't get content for '${id}'.\n\nDoes the path '${filePath}' point to an existing file?\n\nDoes the key '${key}' exist in the file '${filePath}'?`
					);
				} else {
					const filePath = `.../contents${route.replace('[[lang=lang]]', lang)}/page`;
					const key = id;
					console.error(
						`couldn't get content for '${id}'.\n\nDoes the path '${filePath}' point to an existing file?\n\nDoes the key '${key}' exist in the file '${filePath}'?`
					);
				}
			}
			return result;
		},
		lang: lang,
		redirect: async function () {
			if (window) {
				const { goto } = await import('$app/navigation');
				const langPref = getLangPref();
				const nextBestLang =
					config.langs.find((l) => langPref.includes(l) || l.includes(langPref)) ??
					config.defaultLang;
				const newPathname = window.location.pathname.replace(
					/^\/(.)*?((?=\/)|$)/,
					`/${nextBestLang}`
				);

				const newUrl = newPathname + window.location.search + window.location.hash;
				if (lang !== nextBestLang) {
					goto(newUrl);
				}
			}
		}
	};
});

export function getLangPref() {
	if (window) {
		const lS = window.localStorage.getItem('i18n-lang-preference');
		const b = window.navigator.language;
		return lS ?? b;
	} else throw new Error('window is not defined.');
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
