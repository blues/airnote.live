<script>
  import { onMount } from 'svelte';
  import { NotificationDisplay, notifier } from '@beyonk/svelte-notifications';
  import DeviceSettings from './DeviceSettings.svelte';
  import DeviceOwner from './DeviceOwner.svelte';
  import { airnoteProductUID, notehubAPIBase, appUID } from '../../constants';
  import {
    deviceName,
    displayValue,
    indoorDevice,
    sampleFrequencyUSB,
    sampleFrequencyFull,
    sampleFrequencyLow,
    contactName,
    contactEmail,
    contactAffiliation
  } from '../../settingsStore';

  export let pin;
  export let productUID;
  let fetchError = false;
  let saveError = false;
  let notify;

  export let deviceUID;
  export let enableFields = true;
  let eventsUrl = `https://notehub.io/project/${appUID}/events?queryMode=devices&queryDevices=${deviceUID}`;

  const displayOptions = [
    {value: "tempc", text: "Temp (°C)"},
    {value: "tempf", text: "Temp (°F)"},
    {value: "humid", text:"Humidity"},
    {value: "press", text: "Barometric Pressue"},
  ];

  if (productUID === "product:org.airnote.solar.rad.v1") {
    $displayValue = "usv";

    displayOptions.splice(0, 0, {value: "usv", text: "Microsieverts per Hour (default)"});
    displayOptions.push({value: "mrem", text: "Milirem per Hour"});
    displayOptions.push({value: "cpm", text: "LND712 Counts Per Minute"});
  } else {
    $displayValue = "pm2.5";

    displayOptions.splice(0, 0, {value: "pm2.5", text: "PM2.5 (default)"});
    displayOptions.push({value: "pm1.0", text: "PM1.0"});
    displayOptions.push({value: "pm10.0", text: "PM10.0"});
  }

  const createBodyFromStore = () => {
    return {
      "environment_variables": {
        "_sn": $deviceName,
        "_air_mins": `usb:${$sampleFrequencyUSB};high:${$sampleFrequencyFull};normal:${$sampleFrequencyFull};low:${$sampleFrequencyLow};0`,
        "_air_indoors": !!$indoorDevice ? "1" : "0",
        "_air_status": $displayValue,
        "_contact_name": $contactName,
        "_contact_email": $contactEmail,
        "_contact_affiliation": $contactAffiliation,
      }
    };
  };

  const updateSettingsFromEnvVars = (data) => {
    if (data["_sn"]) $deviceName = data["_sn"];
    if (data["_air_mins"]) {
      // Split semi-colon list into an array for parsing and reassembly
      // "usb:15;high:123;normal:123;low:720;0"
      let airMinsVals = data["_air_mins"].split(";").map(item => item.split(":"));
      for (let index = 0; index < airMinsVals.length; index++) {
        const element = airMinsVals[index];
        switch (element[0]) {
          case "usb":
            $sampleFrequencyUSB = element[1];
            break;
          case "high":
            $sampleFrequencyFull = element[1];
            break;
          case "low":
            $sampleFrequencyLow = element[1];
            break;
        }
      }
    }
    if (data["_air_indoors"]) $indoorDevice = data["_air_indoors"] === "0" ? false : true;
    if (data["_air_status"]) $displayValue = data["_air_status"];
    if (data["_contact_name"]) $contactName = data["_contact_name"];
    if (data["_contact_email"]) $contactEmail = data["_contact_email"];
    if (data["_contact_affiliation"]) $contactAffiliation = data["_contact_affiliation"];
  }

  const handleSettingsSave = async () => {
    const varsBody = createBodyFromStore();

		const url = `${notehubAPIBase}/v1/products/${airnoteProductUID}/devices/${deviceUID}/environment_variables_with_pin`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': pin
    };

    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(varsBody)
    });
    if (response.status !== 200) {
      saveError = true;
    } else {
      notifier.success('Settings saved.');
    }
  }

  onMount(async () => {
    // If no Pin, Get Env Vars using legacy req API
    if (pin === '') {
      enableFields = false;
      const envVarsReadOnlyUrl = `${notehubAPIBase}/req?product="${airnoteProductUID}"&device="${deviceUID}"`;
      const envVarsReadOnlyPayload = '{"req":"hub.env.get","scope":"device"}';

      const response = await fetch(envVarsReadOnlyUrl, {
        method: 'POST',
        body: envVarsReadOnlyPayload
      });
      const data = await response.json();

      // Get current Env Vars from response
      const envVars = data["env"];
      // Populate settings object
      updateSettingsFromEnvVars(envVars);

    } else { // If Pin, Get Env Vars using new V1 API
      const envVarsReadWriteUrl = `${notehubAPIBase}/v1/products/${airnoteProductUID}/devices/${deviceUID}/environment_variables_with_pin`;
      const envVarsReadWriteHeader = { 'X-Auth-Token': pin };

      try {
        const response = await fetch(envVarsReadWriteUrl, {
          headers: envVarsReadWriteHeader
        });
        if (response.status !== 200) {
          fetchError = true;
          enableFields = false;
        } else {
          const data = await response.json();

          // Get current Env Vars from response
          const envVars = data["environment_variables"];
          // Populate settings object
          updateSettingsFromEnvVars(envVars);
        }
      } catch (error) {
        fetchError = true;
        enableFields = false;
      }
    }
  });
</script>

{#if fetchError}
  <div class="alert">
    <h4 class="alert-heading">Unable to fetch device details.</h4>
    Please make sure your Airnote is
    <a href="{eventsUrl}" target="_new">online and connected to Notehub.io</a>
    before visiting this page. For help getting started, visit
    <a href="https://start.airnote.live" target="_new">start.airnote.live</a>.
  </div>
{/if}

{#if saveError}
  <div>
    <h4 class="alert-heading">Unable to safe configuration
      settings. Please try again later.
    </div>
{/if}

<section>
  <h1>
    Welcome to Airnote!
  </h1>
  <p>
    You're now part of a community of citizens helping to monitor the 
    air we breathe.
  </p>
  <p>
    Use can now
    <a href="/{deviceUID}/dashboard">view your device’s dashboard</a>,
    check out the 
    <a href="http://tt.safecast.org/map/note:{deviceUID}" target="_blank">global Safecast map</a>,
    or use the forms below to personalize your device.
  </p>

  <p>
    <i>
      For help setting up your Airnote, visit
      <a href='https://start.airnote.live'>start.airnote.live</a>.
    </i>
</section>

<hr />

<NotificationDisplay bind:this={notify} />

<section>
  <DeviceSettings
    enableFields={enableFields}
    displayOptions={displayOptions}
    on:submit={handleSettingsSave}
  />
</section>

<hr />

<section>
  <DeviceOwner
    enableFields={enableFields}
    on:submit={handleSettingsSave}
  />
</section>

<hr />

<section>
  <p>
    <a href={eventsUrl} target="_new">
      View live Airnote events on Notehub.io
    </a>
  </p>
</section>

<hr />

<section>
  <p>
    <i>
      By using your Airnote device, or completing the optional fields
      on this page, you consent to share your device data and the optional
      contact information with Blues Inc. for the purposes of publishing
      public maps and device dashboards.
    </i>
  </p>
</section>

<style>
  p {
    text-align: center;
  }
  section {
    margin: 0 auto;
  }
  @media (max-width: 992px) {
    section {
      max-width: 720px;
    }
  }
</style>
