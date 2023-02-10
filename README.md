# SvelteKit I18n

A library to easily handle content and localization in SvelteKit.

## Installation

```bash
yarn add @frontline-hq/sveltekit-i18n
```

or

```bash
npm install @frontline-hq/sveltekit-i18n
```

## Setup

0 - Install other necessary packages:

```bash
yarn add --dev @mdx-js/rollup @frontline-hq/recma-sections @frontline-hq/rollup-merge-import
```

or

```bash
npm install --save-dev @mdx-js/rollup @frontline-hq/recma-sections @frontline-hq/rollup-merge-import
```

1 - Adjust your vite config to include an mdx loader that supports sections and our rollup plugin for "merge imports":

```ts
// vite.config.ts

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
```

2 - Setup your locale matching in `src/params/lang.ts` to return only the correct locales. This will make sure that the locales within the url of your webapp have to match the array you specified. If a user wants to visit a page on a non-specified locale, this will return an error.

```ts
import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => {
	const locales = ['en', 'de'];
	return locales.includes(param);
}) satisfies ParamMatcher;
```

## Usage

This package populates the data returned from a layout's or page's `load()` function to contain the corresponding mdx files contents.

It exposes three exports:

```ts
// init(), a function to populate your pages data with contents (callable in page / layout load() function)
export async function init({
	lang, // Current page lang, pass from load() params
	pathname, // Current page pathname, pass from load() params
	pathDel = '_', // Delimiter with which fs paths are split upon merge-import
	defaultLang = 'en', // Fallback lang if pathname doesnt contain lang
	layout = true, // Should layout data also be populated?
	page // Should page data be populated?
}: {
	lang: string | undefined;
	pathname: string;
	pathDel?: string;
	defaultLang?: string;
	layout?: boolean;
	page?: boolean;
}): Record<string, unknown> {
	//...
}

/*  getContent(), a function to retrieve populated paths for content
    Takes an id as param.
    - For page data this param should be the lodash path for accessing the mdx files named export directly
    - For layout data, this param still has to include the path (with "_" delimiters) with "_layout" at the end, since there can be multiple layout files applicable to one page / layout

    returns the requested piece of data.
*/
export function getContent(id: string): unknown {
	//...
}

// Default export. Same options, but returns a svelte component that directly renders the requested piece of information (utilizing preact)
export default //...
```

Let's consider the following folder structure for the following explanations:

```
src/
    contents/
        en/
            page.mdx (export both "default" and "one")
            layout.mdx
            folder1/
                page.mdx
                layout.mdx
        de/
            ...
    ...
routes/
    [[lang=lang]]
        +layout.svelte
        +page.svelte
        +page.ts
        folder1/
            +layout.svelte
            +page.ts
            +page.svelte


```

### Retrieve page contents

We'll go through some scenarios to understand page exports:

#### 1 - Display `default` export and log named export `key` from page.mdx in page /en/folder1:

Populate contents with the init function in `load()`:

```ts
// code of .../folder1/+page.ts
import type { PageLoad } from './$types';
import { init } from '@frontline-hq/sveltekit-i18n';

export const load = (async ({ params: { lang }, url: { pathname } }) => {
	const contents = await init({ lang, pathname });
	return { contents };
}) satisfies PageLoad;
```

... and use the contents within the page:

```svelte
<script lang=ts>
    // code of .../folder1/+page.svelte
    import Content, { getContent } from '@frontline-hq/sveltekit-i18n';
    console.log(getContent("key"))
</script>

<Content id="default">
```

#### 2 - Display `default` export from page.mdx in page /en/:

Populate contents with the init function in `load()`:

```ts
// code of .../+page.ts
import type { PageLoad } from './$types';
import { init } from '@frontline-hq/sveltekit-i18n';

export const load = (async ({ params: { lang }, url: { pathname } }) => {
	const contents = await init({ lang, pathname });
	return { contents };
}) satisfies PageLoad;
```

... and use the contents within the page:

```svelte
<script lang=ts>
    // code of .../+page.svelte
    import Content from '@frontline-hq/sveltekit-i18n';
</script>

<Content id="default">
```

I think you can see a pattern arising here now.

### Retrieve layout contents

Layout contents are the contents for `+layout.svelte` pages. They also inherit the contents that their ancestors receive from the `/src/contents` directory.

#### 1 - Display `default` exports from both layout.mdx in layout /en/folder1/layout and /en/layout:

Populate contents with the init function in `load()`:

```ts
// code of .../folder1/+layout.ts
import type { LayoutLoad } from './$types';
import { init } from '@frontline-hq/sveltekit-i18n';

export const load = (async ({ params: { lang }, url: { pathname } }) => {
	const contents = await init({ lang, pathname });
	return { contents };
}) satisfies LayoutLoad;
```

... and use the contents within the layout:

```svelte
<script lang=ts>
    // code of .../folder1/+layout.svelte
    import Content from '@frontline-hq/sveltekit-i18n';
</script>

<!-- This layout inherits the contents from .../+layout.svelte! -->
<Content id="folder1_layout.default">
<Content id="layout.default">
```

### Rules

- You can't retrieve content from .mdx files that do not belong to your page file. We have a 1-1 mapping here. That means contents within page src/en/folder1/ will allways be resolve to /src/contents/en/folder1/page.mdx.
