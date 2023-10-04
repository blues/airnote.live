// The “Dashboard” link in Notehub links to the Airnote site with
// a DeviceUID in the format dev%3abcdef.
export function getPathname() {
  return decodeURIComponent(location.pathname);
}
