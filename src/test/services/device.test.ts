import { describe, it, expect, beforeEach } from 'vitest';
import {
	getCurrentReadings,
	getHistoryReadings,
	getCurrentDeviceFromUrl
} from '$lib/services/device';
import { AIRNOTE_PRODUCT_UID } from '$lib/constants';
import type { NotehubEvent } from '$lib/services/NotehubEventModel';
import type { AirnoteReading } from '$lib/services/AirReadingModel';

describe('Device service', () => {
	describe('getCurrentReadings', () => {
		it('should return an empty array if events is empty', () => {
			const events: NotehubEvent[] = [];
			const deviceUID = '123';
			const readings = getCurrentReadings(events, deviceUID);
			expect(readings).toEqual([]);
		});

		it('should return an array of AirnoteReading objects with correct properties', () => {
			const events: NotehubEvent[] = [
				{
					body: {
						aqi: 64,
						csecs: 60,
						c00_30: 1885,
						c00_50: 552,
						c01_00: 120,
						c02_50: 8,
						c05_00: 1,
						pm01_0: 10.605263,
						pm02_5: 18.131578,
						pm10_0: 19.052631,
						sensor: 'pms7003',
						voltage: 3.9277344,
						charging: true,
						csamples: 38,
						humidity: 50.245625,
						pressure: 98620.74,
						aqi_level: 'moderate',
						pm01_0_rstd: 0.08068848,
						pm02_5_rstd: 0.08618164,
						pm10_0_rstd: 0.103515625,
						temperature: 27.141157,
						aqi_algorithm: 'cf-atm',
						captured: '',
						location: '',
						lat: 0,
						lon: 0,
						serial_number: '',
						device_uid: ''
					},
					when: '2021-09-20T17:32:53Z',
					lat: 34.824667500000004,
					lon: -85.32273828125,
					location: 'New York',
					serial_number: 'airnote-test',
					heatIndex: 0
				}
			];
			const deviceUID = '123';
			const readings = getCurrentReadings(events, deviceUID);
			expect(readings).toEqual([
				{
					aqi: 64,
					aqi_algorithm: 'cf-atm',
					aqi_level: 'moderate',
					c00_30: 1885,
					c00_50: 552,
					c01_00: 120,
					c02_50: 8,
					c05_00: 1,
					captured: '2021-09-20T17:32:53Z',
					charging: true,
					csamples: 38,
					csecs: 60,
					device_uid: '123',
					humidity: 50.245625,
					lat: 34.824667500000004,
					location: 'New York',
					lon: -85.32273828125,
					pm01_0: 10.605263,
					pm01_0_rstd: 0.08068848,
					pm02_5: 18.131578,
					pm02_5_rstd: 0.08618164,
					pm10_0: 19.052631,
					pm10_0_rstd: 0.103515625,
					pressure: 98620.74,
					sensor: 'pms7003',
					serial_number: 'airnote-test',
					temperature: 27.141157,
					voltage: 3.9277344
				}
			]);
		});
	});

	describe('getHistoryReadings', () => {
		it('should return empty objects if readings array is empty', () => {
			const readings: AirnoteReading[] = [];

			const expected = {
				aqi: {},
				pm1_0: {},
				pm2_5: {},
				pm10_0: {}
			};

			expect(getHistoryReadings(readings)).toEqual(expected);
		});

		it('should group readings by calendar day and calculate average AQI, PM01_0, PM02_5, and PM10_0 readings for each day', () => {
			const readings: AirnoteReading[] = [
				{
					captured: '2022-01-01T00:00:00.000Z',
					aqi: 10,
					pm01_0: 1,
					pm02_5: 2,
					pm10_0: 3,
					csecs: 60,
					c00_30: 1411,
					c00_50: 407,
					c01_00: 61,
					c02_50: 3,
					c05_00: 0,
					sensor: 'pms7003',
					voltage: 3.9394531,
					charging: true,
					csamples: 29,
					humidity: 44.25575,
					pressure: 98307.04,
					aqi_level: 'good',
					pm02_5_rstd: 0.19628906,
					pm10_0_rstd: 0.21386719,
					temperature: 31.506496,
					aqi_algorithm: 'cf-atm',
					device_uid: 'dev:123',
					location: 'New York',
					lat: 34.824667500000004,
					lon: -85.32273828125,
					serial_number: 'airnote-test'
				},
				{
					captured: '2022-01-01T01:00:00.000Z',
					aqi: 20,
					pm01_0: 2,
					pm02_5: 4,
					pm10_0: 6,
					csecs: 60,
					c00_30: 1411,
					c00_50: 407,
					c01_00: 61,
					c02_50: 3,
					c05_00: 0,
					sensor: 'pms7003',
					voltage: 3.9394531,
					charging: true,
					csamples: 29,
					humidity: 44.25575,
					pressure: 98307.04,
					aqi_level: 'good',
					pm02_5_rstd: 0.19628906,
					pm10_0_rstd: 0.21386719,
					temperature: 31.506496,
					aqi_algorithm: 'cf-atm',
					device_uid: 'dev:123',
					location: 'New York',
					lat: 34.824667500000004,
					lon: -85.32273828125,
					serial_number: 'airnote-test'
				},
				{
					captured: '2022-01-02T00:00:00.000Z',
					aqi: 30,
					pm01_0: 3,
					pm02_5: 6,
					pm10_0: 9,
					csecs: 60,
					c00_30: 1411,
					c00_50: 407,
					c01_00: 61,
					c02_50: 3,
					c05_00: 0,
					sensor: 'pms7003',
					voltage: 3.9394531,
					charging: true,
					csamples: 29,
					humidity: 44.25575,
					pressure: 98307.04,
					aqi_level: 'good',
					pm02_5_rstd: 0.19628906,
					pm10_0_rstd: 0.21386719,
					temperature: 31.506496,
					aqi_algorithm: 'cf-atm',
					device_uid: 'dev:123',
					location: 'New York',
					lat: 34.824667500000004,
					lon: -85.32273828125,
					serial_number: 'airnote-test'
				}
			];

			const expected = {
				aqi: {
					'December 31 2021': 15,
					'January 01 2022': 30
				},
				pm1_0: {
					'December 31 2021': 2,
					'January 01 2022': 3
				},
				pm2_5: {
					'December 31 2021': 3,
					'January 01 2022': 6
				},
				pm10_0: {
					'December 31 2021': 5,
					'January 01 2022': 9
				}
			};

			expect(getHistoryReadings(readings)).toEqual(expected);
		});
	});

	describe('getCurrentDeviceFromUrl', () => {
		beforeEach(() => {
			localStorage.clear();
		});

		it('should store an empty deviceUID if there’s no device in the URL', () => {
			const location = {
				pathname: '',
				search: ''
			} as Location;
			const currentDevice = getCurrentDeviceFromUrl(location);
			expect(currentDevice.deviceUID).toBe('');
		});

		it('should return an object with data if data is in the URL', () => {
			const location = {
				pathname: '/dev:123456789012345',
				search: '?product=product:org.airnote.solar.v1&pin=123456'
			} as Location;
			const currentDevice = getCurrentDeviceFromUrl(location);
			expect(currentDevice.deviceUID).toBe('dev:123456789012345');
			expect(currentDevice.pin).toBe('123456');
			expect(currentDevice.productUID).toBe('product:org.airnote.solar.v1');
		});

		it("should use a previous device's info if there’s no device in the URL", () => {
			const location = {
				pathname: '/dev:123456789012345',
				search: '?product=product:org.airnote.solar.v1&pin=123456'
			} as Location;

			getCurrentDeviceFromUrl(location);

			const emptyLocation = {
				pathname: '',
				search: ''
			} as Location;
			const currentDevice = getCurrentDeviceFromUrl(emptyLocation);

			expect(currentDevice.deviceUID).toBe('dev:123456789012345');
			expect(currentDevice.pin).toBe('123456');
			expect(currentDevice.productUID).toBe('product:org.airnote.solar.v1');
		});

		it('should get the pin and product UID from storage if you only have a device UID in the URL', () => {
			const location = {
				pathname: '/dev:123456789012345',
				search: '?product=product:org.airnote.solar.v1&pin=123456'
			} as Location;
			getCurrentDeviceFromUrl(location);

			const secondLocation = {
				pathname: '/dev:123456789012345',
				search: ''
			} as Location;
			const currentDevice = getCurrentDeviceFromUrl(secondLocation);

			expect(currentDevice.deviceUID).toBe('dev:123456789012345');
			expect(currentDevice.pin).toBe('123456');
			expect(currentDevice.productUID).toBe('product:org.airnote.solar.v1');
		});

		it('should change the data if the device changes in the URL', () => {
			const location = {
				pathname: '/dev:111',
				search: '?product=product:org.airnote.solar.v1&pin=111111'
			} as Location;

			getCurrentDeviceFromUrl(location);
			const secondLocation = {
				pathname: '/dev:222',
				search: '?product=product:org.airnote.solar.v2&pin=222222'
			} as Location;
			const secondDevice = getCurrentDeviceFromUrl(secondLocation);

			expect(secondDevice.deviceUID).toBe('dev:222');
			expect(secondDevice.pin).toBe('222222');
			expect(secondDevice.productUID).toBe('product:org.airnote.solar.v2');

			const thirdLocation = {
				pathname: '/dev:333',
				search: ''
			} as Location;
			const thirdDevice = getCurrentDeviceFromUrl(thirdLocation);
			expect(thirdDevice.deviceUID).toBe('dev:333');
			expect(thirdDevice.pin).toBe('');
			expect(thirdDevice.productUID).toBe(AIRNOTE_PRODUCT_UID);
		});

		it('should persist the last viewed device if the device is removed from the URL', () => {
			const location = {
				pathname: '/dev:111',
				search: '?product=product:org.airnote.solar.v1&pin=111111'
			} as Location;
			getCurrentDeviceFromUrl(location);

			const emptyLocation = {
				pathname: '',
				search: ''
			} as Location;
			const device = getCurrentDeviceFromUrl(emptyLocation);

			expect(device.deviceUID).toBe('dev:111');
			expect(device.pin).toBe('111111');
			expect(device.productUID).toBe('product:org.airnote.solar.v1');
		});
	});
});
