import { error } from '@sveltejs/kit';
import {
  getDeviceEnvironmentVariables,
  getEvents,
  isValidDeviceUID
} from '$lib/services/notehub';
import { getCurrentReadings, getHistoryReadings } from '$lib/services/device';
import type { NotehubEvent } from '$lib/services/NotehubEventModel';
import type { AirnoteReading } from '$lib/services/AirReadingModel';
import type { AirnoteHistoryReadings } from '$lib/services/AirHistoryModel';
import { ERROR_TYPE } from '$lib/constants/ErrorTypes.js';

export async function load({ params }) {
  const deviceUID = params.deviceUID;
  const allEvents: NotehubEvent[] = [];
  let readings: AirnoteReading[] = [];
  let isIndoor = false;
  let history: AirnoteHistoryReadings = {
    aqi: {},
    pm1_0: {},
    pm2_5: {},
    pm10_0: {}
  };

  if (!isValidDeviceUID(deviceUID)) {
    error(400, {
      message: 'Invalid device UID',
      errorType: ERROR_TYPE.NOTEHUB_ERROR,
      deviceUID
    });
  }

  let erred = false;
  let notehubError: { status: number } | undefined;

  await Promise.all([
    getDeviceEnvironmentVariables(deviceUID),
    getEvents(deviceUID)
  ])
    .then((responses) => {
      const [envVarResponse, eventsResponse] = responses;
      const envVars = envVarResponse.environment_variables;
      const serialNumber = envVars._sn;
      isIndoor = envVars._air_indoors === '1' || envVars.air_indoors === '1';
      allEvents.push(...eventsResponse.events);
      allEvents.forEach((entry) => (entry.serial_number = serialNumber));
      readings = getCurrentReadings(allEvents, deviceUID);
      history = getHistoryReadings(readings);
    })
    .catch((err) => {
      console.error(err);
      erred = true;
      notehubError = err;
    });

  if (erred) {
    if (notehubError && notehubError.status === 404) {
      error(404, {
        message: 'Device not found',
        errorType: ERROR_TYPE.NOTEHUB_ERROR,
        deviceUID
      });
    }
    error(500, {
      message: 'Error fetching data from Notehub',
      errorType: ERROR_TYPE.NOTEHUB_ERROR,
      deviceUID
    });
  }

  return {
    readings,
    history,
    isIndoor
  };
}
