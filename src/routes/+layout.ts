import { identity } from '$lib/stores/identityStore';
import { fetchOrySessionIdentity } from '$lib/ory/kratos';

// store user's Ory identity session for use throughout the rest of the app
export async function load() {
  const userIdentity = await fetchOrySessionIdentity();

  // if userIdentity is not undefined or null, set the identity store
  if (userIdentity !== undefined && userIdentity !== null) {
    identity.set(userIdentity);
  }
}
