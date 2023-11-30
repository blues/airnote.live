import { unparse } from 'papaparse';
import {
  getEvents,
  getDeviceEnvironmentVariables
} from '$lib/services/notehub.js';
import { getCurrentReadings } from '$lib/services/device';
import type { NotehubEvent } from '$lib/services/NotehubEventModel.js';
import type { AirnoteReading } from '$lib/services/AirReadingModel.js';

export async function GET({ url }) {
  const allEvents: NotehubEvent[] = [];
  let readings: AirnoteReading[] = [];

  const deviceUID = String(url.searchParams.get('deviceUID'));

  await Promise.all([
    getDeviceEnvironmentVariables(deviceUID),
    getEvents(deviceUID, '90 days')
  ])
    .then((responses) => {
      const [envVarResponse, eventsResponse] = responses;
      const serialNumber = envVarResponse.environment_variables._sn;
      allEvents.push(...eventsResponse);
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
