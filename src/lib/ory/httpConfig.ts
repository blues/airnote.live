import { Configuration, FrontendApi } from '@ory/client';
import { PUBLIC_ORY_SDK_URL } from '$env/static/public';

// PUBLIC_ORY_SDK_URL is set to http://localhost:4000 in local dev as that's the default for Ory Tunnel: https://www.ory.sh/docs/cli/ory-tunnel
const basePath = PUBLIC_ORY_SDK_URL;

export const oryFrontendApi = new FrontendApi(
  new Configuration({
    basePath: basePath,
    baseOptions: {
      withCredentials: true
    }
  })
);
