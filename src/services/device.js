import { DATE_FORMAT_KEY, airnoteProductUID } from "../constants";
import { format } from "date-fns";
import queryString from "query-string";

function getHistory(readings) {
  // Group the readings into the calendar day they occurred on
  const groupedReadings = {};

  readings.forEach((reading) => {
    const formattedDate = format(new Date(reading.captured), DATE_FORMAT_KEY);
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
  Object.keys(groupedReadings).forEach((date) => {
    let aqiTotal = 0;
    let pm01_0Total = 0;
    let pm02_5Total = 0;
    let pm10_0Total = 0;
    let totalReadings = groupedReadings[date].length;
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
    pm10_0: pm10_0History,
  };
}

export function getReadings(deviceUID) {
  return fetch(
    "http://localhost:3001/?" +
      new URLSearchParams({
        device_uid: deviceUID,
      })
  )
    .then((response) => response.json())
    .then((data) => {
      const readings = [];
      data.reverse().forEach((event) => {
        const data = event.body;
        data.device_uid = event.device_uid;
        data.captured = event.captured;
        data.location = event.gps_location
          ? event.gps_location.name
          : event.tower_location
          ? event.tower_location.name
          : "";
        data.lat = event.gps_location?.latitude;
        data.lon = event.gps_location?.longitude;
        data.serial_number = event.serial_number;
        readings.push(data);
      });

      // Exclude readings with no AQI / PM information
      let filteredReadings = readings.filter((reading) => {
        return reading.pm02_5 !== undefined;
      });

      return {
        readings: filteredReadings,
        history: getHistory(filteredReadings),
      };
    });
}

function saveLastViewedDevice(data) {
  localStorage.setItem("device", JSON.stringify(data));
}
function readLastViewedDevice() {
  return JSON.parse(localStorage.getItem("device")) || {};
}

export function getCurrentDeviceFromUrl(location) {
  const lastViewedDevice = readLastViewedDevice();
  const currentDevice = {};

  const query = queryString.parse(location.search);
  let pin = query["pin"] || "";
  let productUID = query["product"] || airnoteProductUID;
  let deviceUID = location.pathname.match(/dev:\d*/)?.[0] || "";

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
