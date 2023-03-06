import type { Plugin } from 'rollup';
import fs from 'fs';

export default function rollupI18NPlugin(): Plugin {
	const virtualModuleIdConfig = `virtual:i18n-config`;
	const virtualModuleIdStore = `virtual:app-store`;
	const resolvedVirtualModuleIdConfig = '\0' + virtualModuleIdConfig;
	const resolvedVirtualModuleIdStore = '\0' + virtualModuleIdStore;
	return {
		name: 'rollup-i18n-plugin', // required, will show up in warnings and errors
		resolveId(id) {
			if (id.startsWith(virtualModuleIdConfig) || id.startsWith(virtualModuleIdStore)) {
				return '\0' + id;
			}
			return null;
		},
		async load(id) {
			if (id.startsWith(resolvedVirtualModuleIdConfig)) {
				const file = fs.readFileSync(process.cwd() + '/sveltekit-i18n.config.js', 'utf-8');
				return file;
			} else if (id.startsWith(resolvedVirtualModuleIdStore)) {
				return `export * from "${process.cwd()}/node_modules/@sveltejs/kit/src/runtime/app/stores.js"`;
			}
			return null;
		}
	};
}
