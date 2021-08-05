import { appUID, notehubAPIBase, SESSION_TOKEN } from '../constants';

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
        aq: [],
        air: [],
      };
      data.events.forEach(event => {
        if (event.file.startsWith('aq')) {
          returnData.aq.push(event.body);
        }
        if (event.file.startsWith('air')) {
          returnData.air.push(event.body);
        }
      });
      return returnData;
    })
    .catch(error => {
      console.log(error);
    });
}