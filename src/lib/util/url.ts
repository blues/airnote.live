// The “Dashboard” link in Notehub links to the Airnote site with
import { APP_UID } from '$lib/constants';

// a DeviceUID in the format dev%3abcdef.
export function getPathname() {
  return decodeURIComponent(location.pathname);
}

// remove the "dev:" prefix from the DeviceUID. (Required for filtering Notehub events correctly when exporting data after being redirected to Notehub)
export function getDeviceUID(deviceUID: string) {
  return deviceUID.replace('dev:', '');
}

export function getNotehubEventsUrl(deviceUID: string) {
  const deviceNumber = getDeviceUID(deviceUID);
  return `https://notehub.io/project/${APP_UID}/events?filter_dev=${deviceNumber}`;
}
