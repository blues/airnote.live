import { AWS_API_BASE, DATE_FORMAT_KEY, airnoteProductUID } from '../constants';
import { format } from 'date-fns';
import queryString from 'query-string';

function getAqiHistory(readings) {
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
  Object.keys(groupedReadings).forEach(date => {
    let aqiTotal = 0;
    let aqiReadings = 0;
    groupedReadings[date].forEach(reading => {
      // There are some strange outliers in the sensor data and
      // we don’t want them to wildly throw off the averages.
      if (reading.pms_aqi < 500) {
        aqiTotal += reading.pms_aqi;
        aqiReadings++;
      }
    });
    aqiHistory[date] = Math.round(aqiTotal / aqiReadings);
  });

  return aqiHistory;
}

export function getReadings(deviceUID) {
  var eightDaysAgo = new Date(new Date().setDate(new Date().getDate() - 8));

  return fetch(`${AWS_API_BASE}/getDeviceData?` + new URLSearchParams({
    device_uid: deviceUID,
    from: eightDaysAgo.toISOString(),
    to: new Date().toISOString()
  }))
    .then(response => response.json())
    .then(data => {
      const readings = [];
      data.hits.hits.forEach(reading => {
        readings.push(reading._source);
      });
      return {
        readings: readings,
        aqiHistory: getAqiHistory(readings)
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
    pin = lastViewedDevice.pin;
    productUID = lastViewedDevice.productUID;
  }

  currentDevice.pin = pin;
  currentDevice.deviceUID = deviceUID;
  currentDevice.productUID = productUID;

  if (deviceUID) {
    saveLastViewedDevice(currentDevice);
  }

  return currentDevice;
}
