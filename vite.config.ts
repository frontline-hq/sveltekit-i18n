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
