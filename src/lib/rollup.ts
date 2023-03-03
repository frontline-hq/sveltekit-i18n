import type { Plugin } from 'rollup';
import fs from 'fs';

export default function rollupI18NPlugin(): Plugin {
	const virtualModuleId = `virtual:i18n-config`;
	const resolvedVirtualModuleId = '\0' + virtualModuleId;
	return {
		name: 'rollup-i18n-plugin', // required, will show up in warnings and errors
		resolveId(id) {
			if (id.startsWith(virtualModuleId)) {
				return '\0' + id;
			}
			return null;
		},
		async load(id) {
			if (id.startsWith(resolvedVirtualModuleId)) {
				const file = fs.readFileSync(process.cwd() + '/sveltekit-i18n.config.js', 'utf-8');
				return file;
			}
			return null;
		}
	};
}
