/// <reference types="vite/client" />

declare module 'virtual:i18n-config' {
	// eslint-disable-next-line
	const config: { langs: string[]; defaultLang: string };
	export default config;
}
