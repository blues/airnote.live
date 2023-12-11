import { error } from '@sveltejs/kit';
import { ERROR_TYPE } from '$lib/constants/ErrorTypes';

// load all the quickstart files together in a list
const quickstartFiles = [
  '../../setup-files/00 Main.mdx',
  '../../setup-files/01 Introduction.mdx',
  '../../setup-files/02 Unboxing Your Airnote.mdx',
  '../../setup-files/03 Airnote Setup.mdx',
  '../../setup-files/04 Visit Your Device Dashboard.mdx',
  '../../setup-files/05 Understanding Air Quality.mdx',
  '../../setup-files/06 FAQ.mdx'
];

async function getFileData(file: string) {
  const doc = await import(file /* @vite-ignore */);
  return {
    content: doc.default
  };
}

export async function load() {
  // loop through each mdx file and get the data from it
  const docs = await Promise.all(quickstartFiles.map(getFileData))
    .then((responses) => {
      return responses;
    })
    .catch((err) => {
      console.error(err);
      throw error(500, {
        message: 'Unable to load Airnote quickstart documentation.',
        errorType: ERROR_TYPE.DOCS_ERROR
      });
    });

  return { docs, error };
}
