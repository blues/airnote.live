<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { NotificationDisplay, notifier } from '@beyonk/svelte-notifications';
  import {
    APP_UID,
    AIRNOTE_V3_PRODUCT_UID,
    RADNOTE_PRODUCT_UID
  } from '$lib/constants';
  import { getCurrentDeviceFromUrl } from '$lib/services/device';
  import DeviceSettings from './DeviceSettings.svelte';
  import DeviceOwner from './DeviceOwner.svelte';
  import DeviceAdvanced from './DeviceAdvanced.svelte';
  import {
    deviceName,
    displayValue,
    indoorDevice,
    sampleFrequencyUSB,
    sampleFrequencyFull,
    sampleFrequencyLow,
    contactName,
    contactEmail,
    contactAffiliation,
    routingUrl
  } from '$lib/stores/settingsStore';
  import type {
    AirnoteDevice,
    PotentiallyNullDeviceDetails
  } from '$lib/services/DeviceModel';
  import type { DeviceDisplayOption } from '$lib/services/DeviceDisplayModel';
  import { ERROR_TYPE } from '$lib/constants/ErrorTypes';
  import { renderErrorMessage } from '$lib/util/errors';
  import { getNotehubEventsUrl } from '$lib/util/url';

  export let pin: PotentiallyNullDeviceDetails = '';
  export let deviceUID: string = '';
  export let internalNav: PotentiallyNullDeviceDetails = 'false';
  export let productUID: PotentiallyNullDeviceDetails = '';

  let enableFields = false;
  let error = false;
  let errorType: string;

  let eventsUrl = `https://notehub.io/project/${APP_UID}/events`;
  $: if (deviceUID) {
    eventsUrl = getNotehubEventsUrl(deviceUID);
  }

  export let data;

  // Use productUID from server data if available
  $: if (data.productUID) {
    productUID = data.productUID;

    // Update the URL to reflect the correct productUID while preserving other params
    const currentProductInUrl = $page.url.searchParams.get('product');
    if (currentProductInUrl !== productUID) {
      const newUrl = new URL($page.url);
      // This preserves all existing query params (pin, internalNav, etc.) and only updates product
      newUrl.searchParams.set('product', productUID);
      goto(newUrl.toString(), {
        replaceState: true,
        noScroll: true,
        keepFocus: true
      });
    }
  }

  // Make deviceDisplayOptions reactive to productUID changes
  let deviceDisplayOptions: DeviceDisplayOption[] = [];
  let hasSetDefaultDisplayValue = false;

  $: {
    // Reset the options array
    deviceDisplayOptions = [
      { value: 'tempc', text: 'Temp (°C)' },
      { value: 'tempf', text: 'Temp (°F)' },
      { value: 'humid', text: 'Humidity' },
      { value: 'press', text: 'Barometric Pressure' }
    ];

    // Set default display value and add product-specific options
    // Only set default if we haven't already set it (to avoid overriding saved settings)
    if (productUID === RADNOTE_PRODUCT_UID) {
      if (!hasSetDefaultDisplayValue) {
        displayValue.set('usv');
        hasSetDefaultDisplayValue = true;
      }
      deviceDisplayOptions.splice(0, 0, {
        value: 'usv',
        text: 'Microsieverts per Hour (default)'
      });
      deviceDisplayOptions.push({ value: 'mrem', text: 'Milirem per Hour' });
      deviceDisplayOptions.push({
        value: 'cpm',
        text: 'LND712 Counts Per Minute'
      });
    } else if (productUID === AIRNOTE_V3_PRODUCT_UID) {
      if (!hasSetDefaultDisplayValue) {
        displayValue.set('aqi');
        hasSetDefaultDisplayValue = true;
      }
      deviceDisplayOptions.splice(0, 0, {
        value: 'aqi',
        text: 'AQI (default)'
      });
      deviceDisplayOptions.push({ value: 'pm2.5', text: 'PM2.5' });
      deviceDisplayOptions.push({ value: 'pm1.0', text: 'PM1.0' });
      deviceDisplayOptions.push({ value: 'pm10.0', text: 'PM10.0' });
    } else if (productUID) {
      // Default airnote
      if (!hasSetDefaultDisplayValue) {
        displayValue.set('pm2.5');
        hasSetDefaultDisplayValue = true;
      }
      deviceDisplayOptions.splice(0, 0, {
        value: 'pm2.5',
        text: 'PM2.5 (default)'
      });
      deviceDisplayOptions.push({ value: 'pm1.0', text: 'PM1.0' });
      deviceDisplayOptions.push({ value: 'pm10.0', text: 'PM10.0' });
    }
  }

  if (data.error !== undefined) {
    if (data.error.errorType === ERROR_TYPE.MISSING_PIN) {
      error = true;
      errorType = ERROR_TYPE.MISSING_PIN;
    }
    if (data.error.errorType === ERROR_TYPE.INVALID_PIN) {
      error = true;
      errorType = ERROR_TYPE.INVALID_PIN;
    }
    if (data.error.errorType === ERROR_TYPE.NOTEHUB_ERROR) {
      error = true;
      errorType = ERROR_TYPE.NOTEHUB_ERROR;
    }
  } else {
    enableFields = true;
  }

  const updateSettingsFromEnvVars = (
    data: { [property: string]: string },
    currentProductUID: string
  ) => {
    if (data['_sn']) deviceName.set(data['_sn']);

    // For v3 devices, only use non-underscore vars. For legacy devices, use underscore vars.
    const isV3 = currentProductUID === AIRNOTE_V3_PRODUCT_UID;

    const airMinsVar = isV3
      ? data['air_mins']
      : data['_air_mins'] || data['air_mins'];
    const airIndoorsVar = isV3
      ? data['air_indoors']
      : data['_air_indoors'] || data['air_indoors'];
    const airStatusVar = isV3 ? data['air_status'] : data['_air_status'];

    if (airMinsVar) {
      // Split semi-colon list into an array for parsing and reassembly
      // "usb:15;high:123;normal:123;low:720;0"
      const airMinsVals = airMinsVar.split(';').map((item) => item.split(':'));
      for (let index = 0; index < airMinsVals.length; index++) {
        const element = airMinsVals[index];
        switch (element[0]) {
          case 'usb':
            sampleFrequencyUSB.set(element[1]);
            break;
          case 'high':
            sampleFrequencyFull.set(element[1]);
            break;
          case 'low':
            sampleFrequencyLow.set(element[1]);
            break;
        }
      }
    }
    if (airIndoorsVar) indoorDevice.set(airIndoorsVar === '0' ? false : true);
    if (airStatusVar) {
      displayValue.set(airStatusVar);
      hasSetDefaultDisplayValue = true; // Mark that we've loaded a saved value
    }
    if (data['_contact_name']) contactName.set(data['_contact_name']);
    if (data['_contact_email']) contactEmail.set(data['_contact_email']);
    if (data['_contact_affiliation'])
      contactAffiliation.set(data['_contact_affiliation']);
    if (data['_route']) routingUrl.set(data['_route']);
  };

  // Reactively update settings when both notehubResponse and productUID are available
  $: if (data.notehubResponse && productUID) {
    updateSettingsFromEnvVars(data.notehubResponse, productUID);
  }

  const handleSettingsSaved = () => {
    notifier.success('Settings saved.', 3000);
  };

  const handleSettingsError = () => {
    error = true;
    errorType = ERROR_TYPE.UPDATE_ERROR;
  };

  onMount(() => {
    const currentDevice: AirnoteDevice = getCurrentDeviceFromUrl(location);
    pin = currentDevice.pin ? currentDevice.pin : '';
    deviceUID = currentDevice.deviceUID ? currentDevice.deviceUID : '';
    internalNav = currentDevice.internalNav
      ? currentDevice.internalNav
      : 'false';
    // productUID now comes from server data, don't override it from URL
  });
</script>

<svelte:head>
  <title>Airnote Device Configuration</title>
</svelte:head>

{#if error}
  {@html renderErrorMessage(errorType, deviceUID)}
{/if}

<section>
  <h1>Welcome to Airnote!</h1>
  <p>
    You're now part of a community of citizens helping to monitor the air we
    breathe.
  </p>
  <p>
    You can view your device’s dashboard or use the forms below to personalize
    your device.
  </p>
  <p>
    <a href="/{deviceUID}/dashboard" class="btn">View your device’s dashboard</a
    >
  </p>
  <p>
    <i>
      For help setting up your Airnote, visit the
      <a href="/quickstart">Quickstart guide</a>.
    </i>
  </p>
</section>

<hr />

<NotificationDisplay />

<section>
  <DeviceSettings
    {enableFields}
    {deviceDisplayOptions}
    on:settingsSaved={() => handleSettingsSaved()}
    on:settingsError={() => handleSettingsError()}
    {pin}
  />
</section>

<hr />

<section>
  <DeviceOwner
    {enableFields}
    on:settingsSaved={() => handleSettingsSaved()}
    on:settingsError={() => handleSettingsError()}
    {pin}
  />
</section>

<hr />

<section>
  <DeviceAdvanced
    {enableFields}
    on:settingsSaved={() => handleSettingsSaved()}
    on:settingsError={() => handleSettingsError()}
    {pin}
  />
</section>

<hr />

<section>
  <p>
    <a href={eventsUrl} target="_new" data-cy="notehub-link">
      View live Airnote events on Notehub.io
    </a>
  </p>
</section>

<hr />

<section>
  <p>
    <i>
      By using your Airnote device, or completing the optional fields on this
      page, you consent to openly sharing your device data and the optional
      contact information under Creative Commons CC0. For the benefit of the
      community, all devices' data, maps, dashboards, and contact information
      are openly published to the public. If you do not wish your contact
      information to be published, please do not supply it.
    </i>
  </p>
</section>

<style>
  h1,
  a,
  p {
    text-align: center;
  }
  section {
    margin: 0 auto;
    text-align: left;
  }
  @media (max-width: 992px) {
    section {
      max-width: 720px;
      padding: 0 1rem;
    }
  }
</style>
