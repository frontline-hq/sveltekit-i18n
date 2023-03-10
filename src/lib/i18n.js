import config from 'virtual:i18n-config';
import lodash from 'lodash';
import { derived } from 'svelte/store';
import { page } from '$app/stores';

const { get } = lodash;

export function getLangPref() {
	if (window) {
		const lS = window.localStorage.getItem('i18n-lang-preference');
		const b = window.navigator.language;
		return lS ?? b;
	} else throw new Error('window is not defined.');
}

export const i18n = derived(page, ($page) => {
	const lang = $page.params.lang || config.defaultLang;
	const route = $page.route.id || '';
	return {
		get: function (id, pathDel = '_') {
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
