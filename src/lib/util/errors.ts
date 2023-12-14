import { ERROR_TYPE } from '$lib/constants/ErrorTypes';
import { APP_UID } from '$lib/constants';

export function renderErrorMessage(errorType: string, deviceUID?: string) {
  switch (true) {
    case errorType === ERROR_TYPE.NOTEHUB_ERROR:
      return `
        <div class="alert">
          <h4 class="alert-heading">Unable to fetch device details.</h4>
          Please make sure your Airnote is
          <a href="https://notehub.io/project/${APP_UID}/events?queryDevice=${deviceUID}" target="_new"> online and connected to Notehub.io </a>
          before visiting this page. For help getting started, visit the
          <a href="/quickstart">Quickstart guide</a>.
        </div>`;
    case errorType === ERROR_TYPE.NO_DATA_ERROR:
      return `
        <div class="alert">
          <h4 class="alert-heading">No data</h4>
          <p>
            This Airnote has not reported data in the last seven days. If this
            is a new Airnote, it may take several hours for your device to
            report its first readings. For help setting up your Airnote, visit our
            <a href="/quickstart">Quickstart guide</a>.
          </p>

          <p>
            If this is a device that has previously reported readings, you can 
            <a href="https://discuss.blues.com">reach out on our forum</a> if you
            need help getting your Airnote back up and running.
          </p>
        </div>`;
    case errorType === ERROR_TYPE.MISSING_PIN:
    case errorType === ERROR_TYPE.INVALID_PIN:
      return `
        <div class="alert">
          <h4 class="alert-heading">Unauthorized</h4>
          It appears you do not have permission to edit settings, just view. 
          If you believe you are receiving this message in error, please try 
          scanning your Airnote QR code on the back of the device or 
          reviewing our documentation on how to set up your Airnote, 
          <a href="/quickstart">here</a>.
        </div>`;
    case errorType === ERROR_TYPE.UPDATE_ERROR:
      return `
         <div class="warning">
            Unable to save new configuration settings. Please try again later.
        </div>`;
    case errorType === ERROR_TYPE.DOCS_ERROR:
      return `
        <div class="alert">
          <h4 class="alert-heading">Unable to load Airnote quickstart documentation.</h4>
          Please try refreshing the page or <a href="https://discuss.blues.com">reach out on our forum</a> if you
          need help getting your Airnote up and running.
        </div>`;
    default:
      return `
        <div class="alert">
          <h4 class="alert-heading">Unable to fetch device details.</h4>
          Please make sure your Airnote is
          <a href="https://notehub.io/project/${APP_UID}/events?queryDevice=${deviceUID}" target="_new"> online and connected to Notehub.io </a>
          before visiting this page. For help getting started, visit our <a href="/quickstart">Quickstart guide</a>.
        </div>`;
  }
}
