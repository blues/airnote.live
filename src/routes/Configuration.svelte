<script>
  import { onMount } from 'svelte';
  import {
    Alert,
    Button,
    Jumbotron,
    Col,
    Row
  } from 'sveltestrap';
  import { NotificationDisplay, notifier } from '@beyonk/svelte-notifications';
  import Settings from '../components/Settings.svelte';
  import Owner from '../components/Owner.svelte';
  import { airnoteProductUID, notehubAPIBase, appUID } from '../constants';
  import {
    deviceName,
    displayValue,
    sampleFrequencyUSB,
    sampleFrequencyFull,
    sampleFrequencyLow,
    contactName,
    contactEmail,
    contactAffiliation
  } from '../settingsStore';

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

  const shareDevice = () => {
    if (navigator.share) { // Share Device URL with Web Share API
      navigator.share({
        title: 'Device Dashboard',
        url: `https://airnote.live/${deviceUID}`
      }).then(() => {
        notifier.success('Thanks for sharing!');
      })
      .catch(console.error);
    } else {
      // Fallback to copying text to the users clipboard with a
      // hacky cross-browser approach.
      const el = document.createElement('textarea');
      el.value = `https://airnote.live/${deviceUID}`;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      notifier.success('Dashboard URL Copied to clipboard!');
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

{#if pin === ''}
  <Alert color="warning" isOpen={true}>
    <h4 class="alert-heading text-capitalize">No PIN provided</h4>
    You can view this page in read-only mode, but cannot edit device
    configuration settings.
  </Alert>
{/if}
{#if fetchError}
  <Alert color="danger" isOpen={true}>
    <h4 class="alert-heading text-capitalize">Unable to fetch device details.</h4>
    Please make sure your Airnote is
    <a href="{eventsUrl}" target="_new">online and connected to Notehub.io</a>
    before visiting this page. For help getting started, visit
    <a href="https://start.airnote.live" target="_new">start.airnote.live</a>.
  </Alert>
{/if}
{#if saveError}
  <Alert color="danger" isOpen={true}>
    <h4 class="alert-heading text-capitalize">Unable to safe configuration
      settings. Please try again later.
  </Alert>
{/if}
<Jumbotron class='no-bg'>
  <h5>
    Welcome to Airnote!
  </h5>
  <p>You're now part of a community of citizens helping to
    monitor the air we breathe.</p><p>Use the fields below to
    personalize your device, or click the links to
    view charts for your device and the global Safecast map.
  </p>
  <hr class='my-4' />
  <Row>
    <Col><i>{deviceUID}</i></Col>
  </Row>
  <Row>
    <Col><h4><a href="https://safecast.org" target="_new">Safecast</a></h4></Col>
  </Row>
  <Row class="links">
    <Col>
      <a href='http://tt.safecast.org/id/note:{deviceUID}'>Dashboard</a>
    </Col>
    <div class='separator'>|</div>
    <Col>
      <a href='http://tt.safecast.org/map/note:{deviceUID}'>Global Map</a>
    </Col>
  </Row>
  <Row class="share">
    <Col>
        <Button color="primary" on:click={shareDevice}>Share my Device Dashboard</Button>
    </Col>
  </Row>
  <hr class='my-4' />
  <p>
    <i>
      For help setting-up your Airnote, visit
      <a href='https://start.airnote.live'>start.airnote.live</a>
    </i>
  </p>
</Jumbotron>

<NotificationDisplay bind:this={notify} />
<Settings
  enableFields={enableFields}
  displayOptions={displayOptions}
  on:submit={handleSettingsSave}
/>
<hr class='my-4' />
<Owner
  enableFields={enableFields}
  on:submit={handleSettingsSave}
/>
<hr class='my-4' />
<Row>
  <Col>
    <a href={eventsUrl} target="_new">
      View live Airnote events on Notehub.io
    </a>
  </Col>
</Row>
<hr class='my-4' />
<Row>
  <Col>
    <i>
      By using your Airnote device, or completing the optional fields
      on this page, you consent to share your device data and the optional
      contact information with Blues Inc. for the purposes of publishing
      public maps and device dashboards.
    </i>
  </Col>
</Row>

<style>

  :global(h4) {
    font-weight: bold;
    font-size: 20px;
    line-height: 28px;
    text-align: center;
    letter-spacing: 0.01em;
    color: #050607;
  }

  :global(.links) {
    text-align: center;
    line-height: 38px;
  }


  :global(.no-bg) {
    background-color: #fff;
  }

  .separator {
    font-size: 1.5rem;
    color: #CED9E1;
  }

  :global(.share) {
    margin-top: 10px;
  }

  :global(a) {
    font-size: 18px;
    line-height: 22px;
    text-align: center;
    color: #00B9FF;
  }

  :global(.btn) {
    background-color: #00B9FF;
    border-color: #00B9FF;
  }

  :global(.jumbotron) {
    margin-bottom: 0;
    padding: 0;
  }

  :global(.toast) {
    opacity: unset;
  }
</style>
