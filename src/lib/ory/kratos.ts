import { oryFrontendApi } from '$lib/ory/httpConfig';

export async function fetchOrySessionIdentity() {
  try {
    const res = await oryFrontendApi.toSession();
    return res.data.identity;
  } catch (err) {
    console.error(err);
    // todo handle other possible error states in the future
    if (err.response.status === 401) {
      console.log('no valid session found');
      return;
    }
  }
}

export async function fetchOryLoginUrl() {
  try {
    const res = await oryFrontendApi.createBrowserLoginFlow();
    console.log('res', res.data.request_url);
    return res.data.request_url;
  } catch (err) {
    // todo handle with better error messaging in the future
    console.error('Error creating login flow ', err);
    return;
  }
}

export async function fetchOryLogoutUrl() {
  try {
    const res = await oryFrontendApi.createBrowserLogoutFlow();

    return res.data.logout_url;
  } catch (err) {
    // todo handle with better error messaging in the future
    console.error('Error creating logout flow ', err);
    return;
  }
}
