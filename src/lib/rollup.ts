import type { Plugin } from 'rollup';
import fs from 'fs';
import path from 'path';

export default function rollupI18NPlugin(): Plugin {
	const virtualModuleIdConfig = `virtual:i18n-config`;
	const virtualModuleIdStore = `virtual:i18n`;
	const resolvedVirtualModuleIdConfig = '\0' + virtualModuleIdConfig;
	const resolvedVirtualModuleIdStore = '\0' + virtualModuleIdStore;
	return {
		name: 'rollup-i18n-plugin', // required, will show up in warnings and errors
		resolveId(id, importer) {
			if (id === virtualModuleIdConfig) {
				return '\0' + id;
			} else if (id === virtualModuleIdStore && importer) {
				return '\0' + id + '?' + path.dirname(importer ?? '');
			}
			return null;
		},
		async load(id) {
			if (id === resolvedVirtualModuleIdConfig) {
				const file = fs.readFileSync(process.cwd() + '/sveltekit-i18n.config.js', 'utf-8');
				return file;
			} else if (id.startsWith(resolvedVirtualModuleIdStore + '?')) {
				const importerDir = id.split('?')[1];
				const file = fs.readFileSync(importerDir + '/i18n.js', 'utf-8');
				return file;
			}
			return null;
		}
	};
}
