import { error } from '@sveltejs/kit';
import { getDeviceEnvironmentVariables, getEvents } from '$lib/services/notehub';
import { getCurrentReadings, getHistoryReadings } from '$lib/services/device';
import type { NotehubEvent } from '$lib/services/NotehubEventModel';
import type { AirnoteReading } from '$lib/services/AirReadingModel';
import type { AirnoteHistoryReadings } from '$lib/services/AirHistoryModel';

export async function load({ params }) {
	const deviceUID = params.deviceUID;
	const allEvents: NotehubEvent[] = [];
	let readings: AirnoteReading[] = [];
	let history: AirnoteHistoryReadings = {
		aqi: {},
		pm1_0: {},
		pm2_5: {},
		pm10_0: {}
	};

	let erred = false;
	let notehubError: { status: number } | undefined;

	await Promise.all([getDeviceEnvironmentVariables(deviceUID), getEvents(deviceUID)])
		.then((responses) => {
			const [envVarResponse, eventsResponse] = responses;
			const serialNumber = envVarResponse.environment_variables._sn;
			allEvents.push(...eventsResponse);
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
		if (notehubError) {
			if (notehubError.status === 404) {
				throw error(404, {
					message: 'Device not found',
					errorType: 'Notehub error',
					deviceUID
				});
			} else {
				throw error(500, {
					message: 'Error fetching data from Notehub',
					errorType: 'Notehub error',
					deviceUID
				});
			}
		}
	} else {
		return {
			readings,
			history
		};
	}
}
