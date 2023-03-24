import type { PageLoad } from './$types';
import { initTemplate } from '$lib/i18n';
import config from 'virtual:i18n-config';
export const prerender = true;

export const load = (async ({ params: { lang }, url: { pathname } }) => {
	const init = initTemplate(config);
	const contents = await init({ lang, pathname });
	return { contents };
}) satisfies PageLoad;
