<script>
  import { onMount } from "svelte";
  import { NotificationDisplay, notifier } from "@beyonk/svelte-notifications";
  import DeviceSettings from "./DeviceSettings.svelte";
  import DeviceOwner from "./DeviceOwner.svelte";
  import { APP_UID, RADNOTE_PRODUCT_UID } from "../../constants";
  import { ERROR_TYPE } from "../../constants/ErrorTypes";
  import { renderErrorMessage } from "../../util/errors";
  import {
    getDeviceEnvVars,
    checkDeviceEnvVarModificationAccess,
    updateDeviceEnvVars,
  } from "../../services/device";
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
  } from "../../settingsStore";

  export let pin;
  export let productUID;
  export let deviceUID;
  let enableFields = false;
  let error = false;
  let errorType;
  let notify;

  let eventsUrl = `https://notehub.io/project/${APP_UID}/events?queryMode=devices&queryDevices=${deviceUID}`;

  const displayOptions = [
    { value: "tempc", text: "Temp (°C)" },
    { value: "tempf", text: "Temp (°F)" },
    { value: "humid", text: "Humidity" },
    { value: "press", text: "Barometric Pressue" },
  ];

  if (productUID === RADNOTE_PRODUCT_UID) {
    $displayValue = "usv";

    displayOptions.splice(0, 0, {
      value: "usv",
      text: "Microsieverts per Hour (default)",
    });
    displayOptions.push({ value: "mrem", text: "Milirem per Hour" });
    displayOptions.push({ value: "cpm", text: "LND712 Counts Per Minute" });
  } else {
    $displayValue = "pm2.5";

    displayOptions.splice(0, 0, { value: "pm2.5", text: "PM2.5 (default)" });
    displayOptions.push({ value: "pm1.0", text: "PM1.0" });
    displayOptions.push({ value: "pm10.0", text: "PM10.0" });
  }

  const createBodyFromStore = () => {
    return {
      environment_variables: {
        _sn: $deviceName,
        _air_mins: `usb:${$sampleFrequencyUSB};high:${$sampleFrequencyFull};normal:${$sampleFrequencyFull};low:${$sampleFrequencyLow};0`,
        _air_indoors: !!$indoorDevice ? "1" : "0",
        _air_status: $displayValue,
        _contact_name: $contactName,
        _contact_email: $contactEmail,
        _contact_affiliation: $contactAffiliation,
      },
    };
  };

  const updateSettingsFromEnvVars = (data) => {
    if (data["_sn"]) $deviceName = data["_sn"];
    if (data["_air_mins"]) {
      // Split semi-colon list into an array for parsing and reassembly
      // "usb:15;high:123;normal:123;low:720;0"
      let airMinsVals = data["_air_mins"]
        .split(";")
        .map((item) => item.split(":"));
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
    if (data["_air_indoors"])
      $indoorDevice = data["_air_indoors"] === "0" ? false : true;
    if (data["_air_status"]) $displayValue = data["_air_status"];
    if (data["_contact_name"]) $contactName = data["_contact_name"];
    if (data["_contact_email"]) $contactEmail = data["_contact_email"];
    if (data["_contact_affiliation"])
      $contactAffiliation = data["_contact_affiliation"];
  };

  const handleSettingsSave = () => {
    const varsBody = createBodyFromStore();

    updateDeviceEnvVars(productUID, deviceUID, pin, varsBody)
      .then((data) => {
        if (data.successfullyUpdated) {
          notifier.success("Settings saved.");
        } else {
          error = true;
          errorType = ERROR_TYPE.UPDATE_ERROR;
        }
      })
      .catch((err) => {
        console.error(err);
        error = true;
        errorType = ERROR_TYPE.NOTEHUB_ERROR;
      });
  };

  onMount(() => {
    // fetch the device env variables to display in inputs
    getDeviceEnvVars(deviceUID)
      .then((data) => {
        updateSettingsFromEnvVars(data);
      })
      .catch((err) => {
        console.error(err);
        error = true;
        errorType = ERROR_TYPE.NOTEHUB_ERROR;
      });

    // check for pin and display message if it does not exist
    if (pin === "") {
      error = true;
      errorType = ERROR_TYPE.MISSING_PIN;
    } else {
      // if pin exists, check its validity to change device settings
      checkDeviceEnvVarModificationAccess(productUID, deviceUID, pin)
        .then((data) => {
          // if pin is valid, enable inputs
          if (data.canModify) {
            error = false;
            enableFields = true;
          } else {
            // if pin is invalid, display message it is invalid
            error = true;
            errorType = ERROR_TYPE.INVALID_PIN;
            enableFields = false;
          }
        })
        .catch((err) => {
          console.error(err);
          error = true;
          errorType = ERROR_TYPE.NOTEHUB_ERROR;
        });
    }
  });
</script>

<svelte:head>
  <title>Airnote Device Configuration</title>
</svelte:head>

{#if error}
  {@html renderErrorMessage(errorType, eventsUrl)}
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
      For help setting up your Airnote, visit
      <a href="https://start.airnote.live">start.airnote.live</a>.
    </i>
  </p>
</section>

<hr />

<NotificationDisplay bind:this={notify} />

<section>
  <DeviceSettings
    {enableFields}
    {displayOptions}
    on:submit={handleSettingsSave}
  />
</section>

<hr />

<section>
  <DeviceOwner {enableFields} on:submit={handleSettingsSave} />
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
  h1 {
    text-align: center;
  }
  a {
    text-align: center;
  }
  p {
    text-align: center;
  }
  section {
    margin: 0 auto;
  }
  @media (max-width: 992px) {
    section {
      max-width: 720px;
      padding: 0 1rem;
    }
  }
</style>
