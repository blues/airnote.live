import { DATE_FORMAT_KEY, AIRNOTE_PRODUCT_UID } from '$lib/constants';
import { format } from 'date-fns';
import queryString from 'query-string';
import type { AirnoteReading } from '$lib/services/AirReadingModel';
import type { NotehubEvent } from '$lib/services/NotehubEventModel';
import type { AirnoteDevice } from '$lib/services/DeviceModel';
import type { DeviceDisplayOption } from '$lib/services/DeviceDisplayModel';

export function getHistoryReadings(readings: AirnoteReading[]) {
	// Group the readings into the calendar day they occurred on
	const groupedReadings: Record<string, AirnoteReading[]> = {};

	readings.forEach((reading) => {
		const formattedDate = format(new Date(reading.captured), DATE_FORMAT_KEY);
		if (groupedReadings[formattedDate]) {
			groupedReadings[formattedDate].push(reading);
		} else {
			groupedReadings[formattedDate] = [reading];
		}
	});

	// Now get the average aqi reading on each of those days
	const aqiHistory: { [key: string]: number } = {};
	const pm01_0History: { [key: string]: number } = {};
	const pm02_5History: { [key: string]: number } = {};
	const pm10_0History: { [key: string]: number } = {};
	Object.keys(groupedReadings).forEach((date) => {
		let aqiTotal = 0;
		let pm01_0Total = 0;
		let pm02_5Total = 0;
		let pm10_0Total = 0;
		const totalReadings = groupedReadings[date].length;
		groupedReadings[date].forEach((reading) => {
			aqiTotal += reading.aqi;
			pm01_0Total += reading.pm01_0;
			pm02_5Total += reading.pm02_5;
			pm10_0Total += reading.pm10_0;
		});
		aqiHistory[date] = Math.round(aqiTotal / totalReadings);
		pm01_0History[date] = Math.round(pm01_0Total / totalReadings);
		pm02_5History[date] = Math.round(pm02_5Total / totalReadings);
		pm10_0History[date] = Math.round(pm10_0Total / totalReadings);
	});

	return {
		aqi: aqiHistory,
		pm1_0: pm01_0History,
		pm2_5: pm02_5History,
		pm10_0: pm10_0History
	};
}

export function getCurrentReadings(events: NotehubEvent[], deviceUID: string) {
	const readings: AirnoteReading[] = [];
	events.forEach((event) => {
		const data: AirnoteReading = event.body;
		data.device_uid = deviceUID;
		data.captured = event.when;
		data.location = event.location;
		data.lat = event.lat;
		data.lon = event.lon;
		data.serial_number = event.serial_number;
		data.aqi = event.body.aqi ? event.body.aqi : 0;
		data.pm01_0 = event.body.pm01_0 ? event.body.pm01_0 : 0;
		data.pm02_5 = event.body.pm02_5 ? event.body.pm02_5 : 0;
		data.pm10_0 = event.body.pm10_0 ? event.body.pm10_0 : 0;
		readings.push(data);
	});

	return readings;
}

function saveLastViewedDevice(data: AirnoteDevice) {
	localStorage.setItem('device', JSON.stringify(data));
}

function readLastViewedDevice() {
	const device: string | null = localStorage.getItem('device');

	if (device !== null) {
		return JSON.parse(device);
	} else {
		return {};
	}
}

export function getCurrentDeviceFromUrl(location: Location) {
	const lastViewedDevice = readLastViewedDevice();
	const currentDevice: AirnoteDevice = {
		deviceUID: '',
		productUID: '',
		pin: ''
	};

	const query = queryString.parse(location.search);
	let pin = query['pin'] || '';
	let productUID = query['product'] || AIRNOTE_PRODUCT_UID;
	let deviceUID = location.pathname.match(/dev:\d*/)?.[0] || '';
	const internalNav = query['internalNav'];

	// If there is no device in the query string default to the
	// last viewed device.
	if (lastViewedDevice.deviceUID && !deviceUID) {
		deviceUID = lastViewedDevice.deviceUID;
	}

	// If still working with the last viewed device, and we don’t have
	// a pin or productUID in the URL, grab those from local storage.
	if (deviceUID === lastViewedDevice.deviceUID) {
		if (!pin) pin = lastViewedDevice.pin;
		if (!productUID) productUID = lastViewedDevice.productUID;
	}

	currentDevice.pin = pin;
	currentDevice.deviceUID = deviceUID;
	currentDevice.productUID = productUID;

	if (deviceUID) {
		saveLastViewedDevice(currentDevice);
	}

	// Don’t save whether this was internal navigation in local storage
	currentDevice.internalNav = internalNav;

	return currentDevice;
}

export const deviceDisplayOptions: DeviceDisplayOption[] = [
	{ value: 'tempc', text: 'Temp (°C)' },
	{ value: 'tempf', text: 'Temp (°F)' },
	{ value: 'humid', text: 'Humidity' },
	{ value: 'press', text: 'Barometric Pressue' }
];
