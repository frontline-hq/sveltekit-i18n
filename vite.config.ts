import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import mdx from '@mdx-js/rollup';
import recmaSection from '@frontline-hq/recma-sections';
import rollupMergeImport from '@frontline-hq/rollup-merge-import';

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
			external: ['virtual:merge/contents/**/*.mdx'],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					'virtual:merge/contents/**/*.mdx': 'virtual:merge/contents/**/*.mdx'
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
		rollupMergeImport()
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
};

export default config;
