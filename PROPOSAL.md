# Feature proposal

- Loading / importing content data should be page-specific. That means, a page only loads the content that it needs
- Easy to implement
- Exposes a getter function to retrieve contents based on keys.
  - This getter function should infer language and current page path.
  - It should also give a "manual" mode, where lang and page path can be specified manually
- Exposes a web component or svelte component to render the mdx that takes the same options as the getter function

## Possible implementations

- Run a init function in each pages load function that populates the page params context. This function dynamically imports the correct page and language content
- Run a init function in some layouts that does the same (Except that it is page agnostic and only gets the "general" key).
- Export a key getter function that returns the correct content for a key. This function has to adhere to the above mentioned specs
- Export a svelte component to render the correct content for a key.
