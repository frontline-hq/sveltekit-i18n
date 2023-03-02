import type { PageLoad } from './$types';
import { init } from '$lib/index';
export const prerender = true;

export const load = (async ({ params: { lang }, url: { pathname } }) => {
	const contents = await init({ lang, pathname, defaultLang: 'de' });
	return { contents };
}) satisfies PageLoad;
