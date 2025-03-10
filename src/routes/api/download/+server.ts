import pkg from 'papaparse';
import {
  getEvents,
  getDeviceEnvironmentVariables,
  isValidDeviceUID
} from '$lib/services/notehub.js';
import { getCurrentReadings } from '$lib/services/device';
import { ERROR_TYPE } from '$lib/constants/ErrorTypes.js';
import type { NotehubEvent } from '$lib/services/NotehubEventModel.js';
import type { AirnoteReading } from '$lib/services/AirReadingModel.js';

const { unparse } = pkg;

export async function GET({ url }) {
  const deviceUID = String(url.searchParams.get('deviceUID'));

  if (!isValidDeviceUID(deviceUID)) {
    return new Response(
      JSON.stringify({
        message: `Invalid device UID: ${deviceUID}`,
        errorType: ERROR_TYPE.NOTEHUB_ERROR
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const allEvents: NotehubEvent[] = [];
  let readings: AirnoteReading[] = [];

  await Promise.all([
    getDeviceEnvironmentVariables(deviceUID),
    getEvents(deviceUID, 90, true)
  ])
    .then((responses) => {
      const [envVarResponse, eventsResponse] = responses;
      const serialNumber = envVarResponse.environment_variables._sn;
      allEvents.push(...eventsResponse.events);
      allEvents.forEach((entry) => (entry.serial_number = serialNumber));
      readings = getCurrentReadings(allEvents, deviceUID);
    })
    .catch((err) => {
      console.error('Error downloading CSV: ', err);
    });

  const csv = unparse(readings);

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=airnote.csv'
    }
  });
}
