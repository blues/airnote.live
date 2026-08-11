export const AIRNOTE_PRODUCT_UID = 'product:org.airnote.solar.v1';
export const AIRNOTE_V3_PRODUCT_UID = 'product:com.blues.airnote.v3';
export const RADNOTE_PRODUCT_UID = 'product:org.airnote.solar.rad.v1';
export const APP_UID = 'app:2606f411-dea6-44a0-9743-1130f57d77d8';

export const DATE_FORMAT_KEY = 'MMMM dd yyyy';
export const DATE_TIME_FORMAT_KEY = 'MM-dd HH:mm';
export const DATE_TIME_KEY = 'MMM dd yyyy HH:mm a';

/* Sampling intervals (in minutes) a device falls back to when it has no
  air_mins environment variable of its own. Legacy Airnotes inherit 30 from the
  project-level _air_mins; V3 Airnotes inherit 60 from an env.default on the
  Notecard, which Notehub's device environment variable API does not report. */
export const DEFAULT_SAMPLE_FREQUENCY_MINS = '30';
export const AIRNOTE_V3_DEFAULT_SAMPLE_FREQUENCY_MINS = '60';

export const NOTEHUB_API_URL = 'https://api.notefile.net';

export const GA_MEASUREMENT_ID = 'G-PJ7RGMWWBX';
