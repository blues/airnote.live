import { fail, redirect } from '@sveltejs/kit';
import {
  getDeviceEnvironmentVariables,
  getDeviceEnvironmentVariablesByPin,
  updateDeviceEnvironmentVariablesByPin,
  isValidDeviceUID
} from '$lib/services/notehub';
import { ERROR_TYPE } from '$lib/constants/ErrorTypes.js';
import type { DeviceEnvVars } from '$lib/services/DeviceEnvVarModel.js';
import { AIRNOTE_PRODUCT_UID } from '$lib/constants.js';

export async function load({ params, url }) {
  const deviceUID = params.deviceUID;
  const productUID = url.searchParams.get('product') || AIRNOTE_PRODUCT_UID;
  const pin = url.searchParams.get('pin');
  const internalNav = url.searchParams.get('internalNav');

  if (!isValidDeviceUID(deviceUID)) {
    return {
      notehubResponse: null,
      error: { errorType: ERROR_TYPE.NOTEHUB_ERROR }
    };
  }

  /* Notehub links to a device’s dashboard using `/${deviceUID}` with no pin,
    and we want Notehub users to view the device’s dashboard, and not the
    settings page when first directed there from Notehub. */
  if (deviceUID && !pin && internalNav === null) {
    redirect(302, `/${deviceUID}/dashboard`);
  }

  let notehubError: { status: number } | undefined;
  let error;
  let notehubResponse;

  const envVarResponse = await getDeviceEnvironmentVariables(deviceUID).catch(
    (err) => {
      console.error(err);
      notehubError = err;
    }
  );

  if (envVarResponse) {
    notehubResponse = envVarResponse.environment_variables;
  }

  if (pin === '' || pin === null) {
    error = { errorType: ERROR_TYPE.MISSING_PIN };
  } else if (pin !== null) {
    await getDeviceEnvironmentVariablesByPin(productUID, deviceUID, pin).catch(
      (err) => {
        console.error(err);
        error = { errorType: ERROR_TYPE.INVALID_PIN };
      }
    );
  }

  if (notehubError) {
    error = { errorType: ERROR_TYPE.NOTEHUB_ERROR };
  }

  return { notehubResponse, error };
}

export const actions = {
  saveSettings: async ({ params, url, request }) => {
    const deviceUID = params.deviceUID;
    const productUID = url.searchParams.get('product') || AIRNOTE_PRODUCT_UID;
    const pin = url.searchParams.get('pin');
    const body = await request.formData();

    if (!isValidDeviceUID(deviceUID)) {
      return fail(400, { error: { errorType: ERROR_TYPE.NOTEHUB_ERROR } });
    }

    let notehubError: { status: number } | undefined;
    let error;

    let currentEnvVars;
    try {
      const envVarResponse = await getDeviceEnvironmentVariables(deviceUID);
      if (envVarResponse) {
        currentEnvVars = envVarResponse.environment_variables;
      }
    } catch (err) {
      console.error(err);
      notehubError = err as { status: number };
    }

    const formattedBody: DeviceEnvVars = createEnvVarBody(body, currentEnvVars);

    if (pin === '') {
      error = { errorType: ERROR_TYPE.MISSING_PIN };
    } else if (pin !== null) {
      try {
        await updateDeviceEnvironmentVariablesByPin(
          productUID,
          deviceUID,
          pin,
          formattedBody
        );
      } catch (err) {
        console.error(err);
        notehubError = err as { status: number };
      }

      if (notehubError) {
        error = { errorType: ERROR_TYPE.UPDATE_ERROR };
        return fail(500, { error });
      }

      return { success: true };
    }
  }
};

function determineCurrentCheckboxState(
  formData: FormData,
  envVars: { [x: string]: string }
) {
  let currentCheckboxState: string;
  // required logic because unchecked checkboxes are not included in the form data
  // figure out if device settings form is being submitted
  if (formData.get('deviceName')) {
    // check if checkbox data is included in form body (it means checkbox is checked)
    if (formData.get('indoorDevice') === 'on') {
      currentCheckboxState = '1';
    } else {
      currentCheckboxState = '0';
    }
  } else {
    // if device owner settings are submitted, get current checkbox state from envVars
    currentCheckboxState = envVars['_air_indoors']
      ? envVars['_air_indoors']
      : '0';
  }
  return currentCheckboxState;
}

function formatAirSamplingInterval(
  formData: FormData,
  envVars: { [x: string]: string }
) {
  if (formData.get('sampleFrequencyFull')) {
    return `usb:15;high:${formData.get(
      'sampleFrequencyFull'
    )};normal:${formData.get('sampleFrequencyFull')};low:720;43200`;
  } else {
    return envVars['_air_mins'];
  }
}

function createEnvVarBody(
  formData: FormData,
  envVars: { [x: string]: string }
) {
  // combine existing Airnote env vars with the new form data for accurate env var bdy request
  const currentCheckboxState = determineCurrentCheckboxState(formData, envVars);

  return {
    _sn: formData.get('deviceName')
      ? formData.get('deviceName')
      : envVars['_sn'],
    _air_mins: formatAirSamplingInterval(formData, envVars),
    _air_indoors: currentCheckboxState,
    _air_status: formData.get('displayValue')
      ? formData.get('displayValue')
      : envVars['_air_status'],
    _contact_name: formData.get('contactName')
      ? formData.get('contactName')
      : envVars['_contact_name'],
    _contact_email: formData.get('contactEmail')
      ? formData.get('contactEmail')
      : envVars['_contact_email'],
    _contact_affiliation: formData.get('contactAffiliation')
      ? formData.get('contactAffiliation')
      : envVars['_contact_affiliation']
  };
}
