import * as NotehubJs from '@blues-inc/notehub-js';
import { HUB_AUTH_TOKEN } from '$env/static/private';
import type { DeviceEnvVars } from './DeviceEnvVarModel';

const AIRNOTE_PROJECT_UID = 'app:2606f411-dea6-44a0-9743-1130f57d77d8';

const notehubJsClient = NotehubJs.ApiClient.instance;
const deviceApiInstance = new NotehubJs.DeviceApi();

// read env vars only
export async function getDeviceEnvironmentVariables(deviceUID: string) {
  const { api_key } = notehubJsClient.authentications;
  api_key.apiKey = HUB_AUTH_TOKEN;
  return await deviceApiInstance.getDeviceEnvironmentVariables(
    AIRNOTE_PROJECT_UID,
    deviceUID
  );
}

// read env vars by pin
export async function getDeviceEnvironmentVariablesByPin(
  deviceUID: string,
  pinNumber: string
) {
  const { pin } = notehubJsClient.authentications;
  pin.apiKey = pinNumber;
  return await deviceApiInstance.getDeviceEnvironmentVariablesByPin(
    AIRNOTE_PROJECT_UID,
    deviceUID
  );
}

// delete env var by key on device
async function deleteDeviceEnvironmentVariable(deviceUID: string, key: string) {
  const { pin } = notehubJsClient.authentications;
  pin.apiKey = HUB_AUTH_TOKEN;
  return await deviceApiInstance.deleteDeviceEnvironmentVariable(
    AIRNOTE_PROJECT_UID,
    deviceUID,
    key
  );
}

// update env vars on device by pin
async function putDeviceEnvironmentVariablesByPin(
  deviceUID: string,
  pinNumber: string,
  environmentVariables: DeviceEnvVars
) {
  const { pin } = notehubJsClient.authentications;
  pin.apiKey = pinNumber;
  const deviceEnvironmentVariables = new NotehubJs.EnvironmentVariables(
    environmentVariables
  );
  return await deviceApiInstance.putDeviceEnvironmentVariablesByPin(
    AIRNOTE_PROJECT_UID,
    deviceUID,
    deviceEnvironmentVariables
  );
}

export async function updateDeviceEnvironmentVariablesByPin(
  deviceUID: string,
  pinNumber: string,
  environmentVariables: DeviceEnvVars
) {
  // If the _air_mins environment variable is set to the default, don't save the value so
  // the device defaults to the project-level _air_mins. Also, delete the environment variable
  // on the device in case it already exists.
  if (
    environmentVariables._air_mins &&
    environmentVariables._air_mins.toString().includes('high:30')
  ) {
    delete environmentVariables._air_mins;
    await deleteDeviceEnvironmentVariable(deviceUID, '_air_mins');
  }
  return await putDeviceEnvironmentVariablesByPin(
    deviceUID,
    pinNumber,
    environmentVariables
  );
}

// get events from Airnote project in Notehub
export async function getEvents(deviceUID: string) {
  /* this function is originally fetched on mount with 8 days' worth of data to
		  populate the AQI average history with the previous week's data AND
		  display today's most current reading as well */
  const TIMEFRAME = '8 days';

  const body = {
    req: 'hub.app.data.query',
    query: {
      columns:
        ".body;.when;lat:(events.value->'best_lat');lon:(events.value->'best_lon');location:(events.value->'best_location')",
      limit: 1000,
      order: '.modified',
      descending: true,
      where: `.file::text='_air.qo' and .device::text='${deviceUID}' and .modified >= now()-interval '${TIMEFRAME}'`
    }
  };

  const res = await fetch(
    `https://api.notefile.net/req?app=${AIRNOTE_PROJECT_UID}`,
    {
      method: 'POST',
      body: JSON.stringify(body)
    }
  );

  return res.json();
}

export async function loginToNotehub(username: string, password: string) {
  const authApiInstance = new NotehubJs.AuthorizationApi();
  const loginRequest = { username: username, password: password };

  return await authApiInstance.login(loginRequest);
}

export async function loginToOry(username: string, password: string) {
  const res = await fetch(`https://api.notefile.net/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ username: username, password: password })
  });
  return res.json();
}

export async function getProjects(auth_token: string) {
  const projectApiInstance = new NotehubJs.ProjectApi();
  const { api_key } = notehubJsClient.authentications;
  api_key.apiKey = auth_token;

  return await projectApiInstance.getProjects();
}

async function getBillingAccounts(auth_token: string) {
  const billingApiInstance = new NotehubJs.BillingAccountApi();
  const { api_key } = notehubJsClient.authentications;
  api_key.apiKey = auth_token;

  return await billingApiInstance.getBillingAccounts();
}

export async function createProject(auth_token: string, project_name: string) {
  let error;
  const projectApiInstance = new NotehubJs.ProjectApi();
  const { api_key } = notehubJsClient.authentications;
  api_key.apiKey = auth_token;

  // billing account UID required to create project, for now, just use the first result in the array
  const billingAccounts = await getBillingAccounts(auth_token).catch((err) => {
    console.error(err);
    error = err.body;
  });

  if (error && error.status === 'Unauthorized') {
    return error;
  } else {
    const billingAccountUID = billingAccounts.billing_accounts[0].uid;
    const newProjectRequest = new NotehubJs.CreateProjectRequest(
      project_name,
      billingAccountUID
    );

    return await projectApiInstance.createProject(newProjectRequest);
  }
}
