import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';

// Add native lazy-loading + async decoding to all markdown images (the quickstart
// guide) so off-screen images don't block initial render.
function rehypeLazyImages() {
  const visit = (node) => {
    if (node.tagName === 'img') {
      node.properties = node.properties || {};
      node.properties.loading = 'lazy';
      node.properties.decoding = 'async';
    }
    (node.children || []).forEach(visit);
  };
  return (tree) => {
    visit(tree);
  };
}

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  extensions: ['.mdx'],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      { behavior: 'wrap', properties: { class: 'anchor' } }
    ],
    rehypeExternalLinks,
    rehypeLazyImages
  ],
  remarkPlugins: [remarkGfm]
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.mdx'],
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter()
  }
};

export default config;
