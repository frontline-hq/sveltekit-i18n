import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => {
	const locales = ['en', 'de'];
	return locales.includes(param);
}) satisfies ParamMatcher;
