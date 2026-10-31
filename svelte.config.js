import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { fileURLToPath } from 'node:url';

const runbookLayout = fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.svx'],
  preprocess: [
    mdsvex({
      extensions: ['.svx'],
      layout: { runbook: runbookLayout },
    }),
  ],
  kit: {
    adapter: adapter({ pages: 'build', assets: 'build', fallback: undefined }),
    prerender: { entries: ['*'] },
  },
};

export default config;
