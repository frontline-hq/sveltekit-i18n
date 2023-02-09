# Feature proposal

- Loading / importing content data should be page-specific. That means, a page only loads the content that it needs
- Easy to implement
- Exposes a getter function to retrieve contents based on keys.
  - This getter function should infer language and current page path.
  - It should also give a "manual" mode, where lang and page path can be specified manually
- Exposes a web component or svelte component to render the mdx that takes the same options as the getter function
