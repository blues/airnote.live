import * as NotehubJs from '@blues-inc/notehub-js';
import { HUB_AUTH_TOKEN } from '$env/static/private';
import { convertTimeframeToSeconds } from '$lib/util/dates';
import type { DeviceEnvVars } from './DeviceEnvVarModel';

const AIRNOTE_PROJECT_UID = 'app:2606f411-dea6-44a0-9743-1130f57d77d8';

export function isValidDeviceUID(deviceUID: string) {
  const validPrefixes = ['dev:', 'imei:', 'test:', 'id:'];
  return validPrefixes.some((prefix) => deviceUID.startsWith(prefix));
}

export function isValidProductUID(productUID: string) {
  const validProductUIDPrefixes = [
    'com.blues.airnote',
    'org.airnote.solar.v1',
    'product:org.airnote.solar.air.v1'
  ];
  return validProductUIDPrefixes.some((prefix) =>
    productUID.startsWith(prefix)
  );
}

const notehubJsClient = NotehubJs.ApiClient.instance;
const deviceApiInstance = new NotehubJs.DeviceApi();
const eventApiInstance = new NotehubJs.EventApi();

// read env vars only
export async function getDeviceEnvironmentVariables(deviceUID: string) {
  if (!isValidDeviceUID(deviceUID)) {
    console.warn(
      `Invalid device UID ${deviceUID}. Skipping getDeviceEnvVar() API call.`
    );
    return null;
  }

  const { api_key } = notehubJsClient.authentications;
  api_key.apiKey = HUB_AUTH_TOKEN;
  return await deviceApiInstance.getDeviceEnvironmentVariables(
    AIRNOTE_PROJECT_UID,
    deviceUID
  );
}

// read env vars by pin
export async function getDeviceEnvironmentVariablesByPin(
  productUID: string,
  deviceUID: string,
  pinNumber: string
) {
  if (!isValidDeviceUID(deviceUID)) {
    console.warn(
      `Invalid device UID ${deviceUID}. Skipping getDeviceEnvVar() API call.`
    );
  }

  if (!isValidProductUID(productUID)) {
    console.warn(
      `Invalid product UID ${productUID}. Skipping getDeviceEnvVar() API call.`
    );
  }

  const { pin } = notehubJsClient.authentications;
  pin.apiKey = pinNumber;
  return await deviceApiInstance.getDeviceEnvironmentVariablesByPin(
    productUID,
    deviceUID
  );
}

// delete env var by key on device
async function deleteDeviceEnvironmentVariable(deviceUID: string, key: string) {
  if (!isValidDeviceUID(deviceUID)) {
    console.warn(
      `Invalid device UID ${deviceUID}. Skipping deleteDeviceEnvVar() API call.`
    );
  }

  const { pin } = notehubJsClient.authentications;
  pin.apiKey = HUB_AUTH_TOKEN;
  return await deviceApiInstance.deleteDeviceEnvironmentVariable(
    AIRNOTE_PROJECT_UID,
    deviceUID,
    key
  );
}

// update env vars on device by pin
async function putDeviceEnvironmentVariablesByPin(
  productUID: string,
  deviceUID: string,
  pinNumber: string,
  environmentVariables: DeviceEnvVars
) {
  if (!isValidDeviceUID(deviceUID)) {
    console.warn(
      `Invalid device UID ${deviceUID}. Skipping putDeviceEnvVar() API.`
    );
  }

  if (!isValidProductUID(productUID)) {
    console.warn(
      `Invalid product UID ${productUID}. Skipping getDeviceEnvVar() API call.`
    );
  }

  const { pin } = notehubJsClient.authentications;
  pin.apiKey = pinNumber;
  const deviceEnvironmentVariables = new NotehubJs.EnvironmentVariables(
    environmentVariables
  );
  return await deviceApiInstance.putDeviceEnvironmentVariablesByPin(
    productUID,
    deviceUID,
    deviceEnvironmentVariables
  );
}

export async function updateDeviceEnvironmentVariablesByPin(
  productUID: string,
  deviceUID: string,
  pinNumber: string,
  environmentVariables: DeviceEnvVars
) {
  if (!isValidDeviceUID(deviceUID)) {
    console.warn(
      `Invalid device UID ${deviceUID}. Skipping updateDeviceEnvVar() API call.`
    );
  }

  if (!isValidProductUID(productUID)) {
    console.warn(
      `Invalid product UID ${productUID}. Skipping getDeviceEnvVar() API call.`
    );
  }

  // If the _air_mins environment variable is set to the default, don't save the value so
  // the device defaults to the project-level _air_mins. Also, delete the environment variable
  // on the device in case it already exists.
  if (
    environmentVariables._air_mins &&
    environmentVariables._air_mins.toString().includes('high:30')
  ) {
    delete environmentVariables._air_mins;
    await deleteDeviceEnvironmentVariable(deviceUID, '_air_mins');
  }
  return await putDeviceEnvironmentVariablesByPin(
    productUID,
    deviceUID,
    pinNumber,
    environmentVariables
  );
}

// get events from Airnote project in Notehub
export async function getEvents(
  deviceUID: string,
  timeframe = 30,
  includeAllFields = false
) {
  if (!isValidDeviceUID(deviceUID)) {
    console.warn(
      `Invalid device UID ${deviceUID}. Skipping getEvents() API call.`
    );
  }
  /* this function is fetched on mount with 30 days' worth of data to
		  populate the CSV download, the AQI average history AND
		  display today's most current reading as well */

  // convert timeframe into seconds for start and end date
  const { startDateSecs, endDateSecs } = convertTimeframeToSeconds(timeframe);

  const opts = {
    deviceUID: [deviceUID],
    sortBy: 'modified',
    sortOrder: 'desc',
    files: '_air.qo',
    startDate: startDateSecs,
    endDate: endDateSecs,
    pageSize: 10000,
    selectFields: ''
  };

  if (!includeAllFields) {
    opts.selectFields =
      'when,best_location,best_lat,best_lon,serial_number,body.aqi,body.humidity,body.pm01_0,body.pm02_5,body.pm10_0,body.pressure,body.temperature,body.voltage,body.charging';
  }

  return await eventApiInstance.getProjectEvents(AIRNOTE_PROJECT_UID, opts);
}
