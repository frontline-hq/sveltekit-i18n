import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import mdx from '@mdx-js/rollup';
import recmaSection from '@frontline-hq/recma-sections';
import rollupMergeImport from '@frontline-hq/rollup-merge-import';
import rollupI18N from './src/lib/rollup';

function getComment(comment: string) {
	return comment
		? comment.trim().startsWith('c:')
			? comment.trim().slice(2)
			: undefined
		: undefined;
}

const config: UserConfig = {
	build: {
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ['virtual:i18n-config', 'virtual:i18n'],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					'virtual:i18n-config': 'virtual:i18n-config',
					'virtual:i18n': 'virtual:i18n'
				}
			}
		}
	},
	plugins: [
		sveltekit(),
		mdx({
			jsxImportSource: 'preact',
			recmaPlugins: [[recmaSection, { getComment: getComment }]]
		}),
		rollupMergeImport(),
		rollupI18N()
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
};

export default config;
