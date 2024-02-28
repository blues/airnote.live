import { Configuration, FrontendApi } from '@ory/client';
import { PUBLIC_ORY_SDK_URL } from '$env/static/public';

// base path is set to 4000 because that's the default for Ory Tunnel: https://www.ory.sh/docs/cli/ory-tunnel
// const basePath = 'http://localhost:4000';
const basePath = PUBLIC_ORY_SDK_URL;

export const oryFrontendApi = new FrontendApi(
  new Configuration({
    basePath: basePath,
    baseOptions: {
      withCredentials: true
    }
  })
);
