import { AWS_API_BASE, DATE_FORMAT_KEY } from '../constants';
import { format } from 'date-fns';

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