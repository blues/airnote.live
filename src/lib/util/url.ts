// The “Dashboard” link in Notehub links to the Airnote site with
import { APP_UID } from '$lib/constants';

// a DeviceUID in the format dev%3abcdef.
export function getPathname() {
  return decodeURIComponent(location.pathname);
}

export function getNotehubEventsUrl(deviceUID: string) {
  return `https://notehub.io/project/${APP_UID}/events?filter_dev=${deviceUID}`;
}
