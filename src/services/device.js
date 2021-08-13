import { appUID, notehubAPIBase, SESSION_TOKEN } from '../constants';
import { format } from "date-fns";

export function getReadings(deviceUID) {
  const url = `${notehubAPIBase}/v1/projects/${appUID}/events?deviceUIDs=${deviceUID}`;

  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-SESSION-TOKEN': SESSION_TOKEN
    }
  })
    .then(response => response.json())
    .then(data => {
      var returnData = {
        aqReadings: [],
        airReadings: [],
        lastUpdated: new Date(0),
      };
      data.events.forEach(event => {
        if (event.file.startsWith('aq')) {
          returnData.aqReadings.push(event.body);
          if (new Date(event.captured) > returnData.lastUpdated) {
            returnData.lastUpdated = new Date(event.captured);
          }
        }
        if (event.file.startsWith('air')) {
          returnData.airReadings.push(event.body);
        }
      });
      return returnData;
    })
    .catch(error => {
      console.log(error);
    });
}