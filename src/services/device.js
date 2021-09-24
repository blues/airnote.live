import { DATE_FORMAT_KEY, airnoteProductUID } from '../constants';
import { format } from 'date-fns';
import queryString from 'query-string';

function getHistory(readings) {
  // Group the readings into the calendar day they occurred on
  const groupedReadings = {};
  readings.forEach(reading => {
    const formattedDate = format(new Date(reading['@timestamp']), DATE_FORMAT_KEY);
    if (groupedReadings[formattedDate]) {
      groupedReadings[formattedDate].push(reading);
    } else {
      groupedReadings[formattedDate] = [reading];
    }
  });

  // Now get the average aqi reading on each of those days
  const aqiHistory = {};
  const pm01_0History = {};
  const pm02_5History = {};
  const pm10_0History = {};
  Object.keys(groupedReadings).forEach(date => {
    let aqiTotal = 0;
    let pm01_0Total = 0;
    let pm02_5Total = 0;
    let pm10_0Total = 0;
    let totalReadings = groupedReadings[date].length;
    groupedReadings[date].forEach(reading => {
      aqiTotal += reading.pms_aqi;
      pm01_0Total += reading.pms_pm01_0;
      pm02_5Total += reading.pms_pm02_5;
      pm10_0Total += reading.pms_pm10_0;
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
    pm10_0: pm10_0History,
  };
}

export function getReadings(deviceUID) {
  var eightDaysAgo = new Date(new Date().setDate(new Date().getDate() - 8));

  return fetch('https://airnote-api.onrender.com/?' + new URLSearchParams({
    device_uid: deviceUID,
    from: eightDaysAgo.toISOString(),
    to: new Date().toISOString()
  }))
    .then(response => response.json())
    .then(data => {
      const readings = [];
      data.hits.hits.forEach(reading => {
        // There are some strange outliers in the sensor data.
        if (reading._source.pms_aqi < 500) {
          readings.push(reading._source);
        }
      });
      return {
        readings: readings,
        history: getHistory(readings)
      }
    });
}

function saveLastViewedDevice(data) {
  localStorage.setItem('device', JSON.stringify(data));
}
function readLastViewedDevice() {
  return JSON.parse(localStorage.getItem('device')) || {};
}

export function getCurrentDeviceFromUrl(location) {
  const lastViewedDevice = readLastViewedDevice();
  const currentDevice = {};

  const query = queryString.parse(location.search);
  let pin = query['pin'] || '';
  let productUID = query['product'] || airnoteProductUID;
  let deviceUID = location.pathname.match(/dev:\d*/)?.[0] || '';

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

  return currentDevice;
}
