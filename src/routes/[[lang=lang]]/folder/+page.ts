import type { PageLoad } from './$types';
import { init } from '$lib/I18n.svelte';
export const prerender = true;

export const load = (async ({ params: { lang }, url: { pathname } }) => {
	const contents = await init({ lang, pathname });
	return { contents };
}) satisfies PageLoad;
