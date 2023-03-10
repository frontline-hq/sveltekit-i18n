/// <reference types="vite/client" />

import type { Readable } from 'svelte/store';

declare module 'virtual:i18n-config' {
	// eslint-disable-next-line
	const config: { langs: string[]; defaultLang: string };
	export default config;
}

declare module 'virtual:i18n' {
	// eslint-disable-next-line
	type getLangPref = () => string;
	type i18n = Readable<{
		get: (id: string, pathDel?: string) => unknown;
		lang: string;
		redirect: () => Promise<void>;
	}>;
	export { getLangPref, i18n };
}
