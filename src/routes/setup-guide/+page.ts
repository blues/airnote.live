// get all the quickstart files together
const quickstartFiles = [
  '../../setup-files/01 Introduction.mdx',
  '../../setup-files/02 Unboxing Your Airnote.mdx'
];

async function getFileData(file: string) {
  const doc = await import(file /* @vite-ignore */);

  return {
    content: doc.default
  };
}

// todo add a .catch()
export async function load() {
  // loop through each mdx file and get the data from it
  const docs = await Promise.all(quickstartFiles.map(getFileData)).then(
    (responses) => {
      return responses;
    }
  );

  return { docs };
}