import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  // mapbox-gl v3 spawns an ES-module worker (new Worker(url, { type: 'module' }))
  // that uses import.meta; Vite's default 'iife' worker format emits it as a
  // classic script, causing "Cannot use 'import.meta' outside a module".
  worker: {
    format: 'es'
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
