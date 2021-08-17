import { appUID, notehubAPIBase, AWS_API_BASE } from '../constants';

export function getReadings(deviceUID) {
  return fetch(
    AWS_API_BASE + '/getDeviceData?device_uid=' + deviceUID
  )
    .then(response => response.json())
    .then(data => {
      const returnData = [];
      data.hits.hits.forEach(reading => {
        returnData.push(reading._source);
      });
      return returnData;
    })
    .catch(error => {
      console.log(error);
    });
}