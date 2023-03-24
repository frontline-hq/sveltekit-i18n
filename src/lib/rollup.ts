import type { Plugin } from 'rollup';
import fs from 'fs';

export default function rollupI18NPlugin(): Plugin {
	const idConfig = `virtual:i18n-config`;
	const idStore = `virtual:i18n`;
	const resolvedIdConfig = '\0' + idConfig;
	const resolvedIdStore = '\0' + idStore;
	const idComponent = `virtual:i18n-component`;
	const resolvedIdComponent = '\0' + idComponent;
	return {
		name: 'rollup-i18n-plugin', // required, will show up in warnings and errors
		resolveId(id) {
			if (id === idConfig) {
				return resolvedIdConfig;
			} else if (id === idStore) {
				return resolvedIdStore;
			} else if (id === idComponent) {
				return resolvedIdComponent;
			}
			return null;
		},
		async load(id) {
			if (id === resolvedIdConfig) {
				const file = fs.readFileSync(process.cwd() + '/sveltekit-i18n.config.js', 'utf-8');
				return file;
			} else if (id === resolvedIdStore) {
				const config = fs.readFileSync(process.cwd() + '/sveltekit-i18n.config.js', 'utf-8');
				const file = `
${config.replace('export default config;', '')}
import {i18nTemplate, initTemplate, matchTemplate} from '@frontline-hq/sveltekit-i18n/i18n';
import {page} from "$app/stores";
const i18n = i18nTemplate(config, page);
export default i18n;
export const init = initTemplate(config);
export const match = matchTemplate(config);
				`;
				return file;
			}
			return null;
		}
	};
}
