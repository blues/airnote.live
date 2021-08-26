import { airnoteProductUID } from '../../src/constants';
import { getCurrentDeviceFromUrl } from '../../src/services/device';

afterEach(() => {
  localStorage.clear();
});

test('If there’s no device in the URL return an object with no device UID', () => {
  const currentDevice = getCurrentDeviceFromUrl({
    pathname: '',
    search: '',
  });
  expect(currentDevice.deviceUID).toBe('');
});

test('If data is in the URL it should make it to the returned object', () => {
  const currentDevice = getCurrentDeviceFromUrl({
    pathname: '/dev:123456789012345',
    search: '?product=product:org.airnote.solar.v1&pin=123456',
  });
  expect(currentDevice.deviceUID).toBe('dev:123456789012345');
  expect(currentDevice.pin).toBe('123456');
  expect(currentDevice.productUID).toBe('product:org.airnote.solar.v1');
});

test('If there’s no device in the URL, use a previous device’s info', () => {
  getCurrentDeviceFromUrl({
    pathname: '/dev:123456789012345',
    search: '?product=product:org.airnote.solar.v1&pin=123456',
  });
  const currentDevice = getCurrentDeviceFromUrl({
    pathname: '',
    search: '',
  });

  expect(currentDevice.deviceUID).toBe('dev:123456789012345');
  expect(currentDevice.pin).toBe('123456');
  expect(currentDevice.productUID).toBe('product:org.airnote.solar.v1');
});

test('If you only have a device UID in the URL, get the pin and product UID from storage', () => {
  getCurrentDeviceFromUrl({
    pathname: '/dev:123456789012345',
    search: '?product=product:org.airnote.solar.v1&pin=123456',
  });
  const currentDevice = getCurrentDeviceFromUrl({
    pathname: '/dev:123456789012345',
    search: '',
  });

  expect(currentDevice.deviceUID).toBe('dev:123456789012345');
  expect(currentDevice.pin).toBe('123456');
  expect(currentDevice.productUID).toBe('product:org.airnote.solar.v1');
});

test('If the device changes in the URL the data should change as well', () => {
  getCurrentDeviceFromUrl({
    pathname: '/dev:111',
    search: '?product=product:org.airnote.solar.v1&pin=111111',
  });
  const secondDevice = getCurrentDeviceFromUrl({
    pathname: '/dev:222',
    search: '?product=product:org.airnote.solar.v2&pin=222222',
  });

  expect(secondDevice.deviceUID).toBe('dev:222');
  expect(secondDevice.pin).toBe('222222');
  expect(secondDevice.productUID).toBe('product:org.airnote.solar.v2');

  const thirdDevice = getCurrentDeviceFromUrl({
    pathname: '/dev:333',
    search: '',
  });
  expect(thirdDevice.deviceUID).toBe('dev:333');
  expect(thirdDevice.pin).toBe('');
  expect(thirdDevice.productUID).toBe(airnoteProductUID);
});

test('If the device is removed from the URL the last device viewed should persist', () => {
  getCurrentDeviceFromUrl({
    pathname: '/dev:111',
    search: '?product=product:org.airnote.solar.v1&pin=111111',
  });
  const device = getCurrentDeviceFromUrl({
    pathname: '',
    search: '',
  });

  expect(device.deviceUID).toBe('dev:111');
  expect(device.pin).toBe('111111');
  expect(device.productUID).toBe('product:org.airnote.solar.v1');
});
