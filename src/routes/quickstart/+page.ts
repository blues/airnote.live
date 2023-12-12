import { error } from '@sveltejs/kit';
import { ERROR_TYPE } from '$lib/constants/ErrorTypes';

// all static mdx files must be pre-rendered at build time instead of default ssr generated
export const prerender = true;

export async function load() {
  const docs = await import('../../quickstart/00-main.mdx').catch((err) => {
    console.error(err);
    throw error(500, {
      message: 'Unable to load Airnote quickstart documentation.',
      errorType: ERROR_TYPE.DOCS_ERROR
    });
  });

  return {
    content: docs.default
  };
}
