<script>
  import { NotificationDisplay } from '@beyonk/svelte-notifications';
  import { format } from 'date-fns';
  import { unparse } from 'papaparse';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  import CloseIcon from '../../icons/CloseIcon.svelte';
  import ExternalLinkIcon from '../../icons/ExternalLinkIcon.svelte';
  import DownloadIcon from '../../icons/DownloadIcon.svelte';
  import InfoIcon from '../../icons/InfoIcon.svelte';
  import ShareIcon from '../../icons/ShareIcon.svelte';
  import PrintIcon from '../../icons/PrintIcon.svelte';

  import History from './History.svelte';
  import Map from './Map.svelte';
  import Recommendation from './Recommendation.svelte';
  import Speedometer from './Speedometer.svelte';
  import TOOLTIP_STATES from './TooltipStates';
  import { getHeatIndex, getPM2_5Display, getPM10Display, toFahrenheit, toCelsius } from '../../services/air';
  import { getReadings } from '../../services/device';
  import { shareDashboard } from '../../util/share';
  import { NO_DATA_ERROR_HEADING, FETCH_ERROR_HEADING } from '../../constants';

  export let deviceUID;

  let lastReading;
  let readings;
  let history;

  let noDataError = false;
  let fetchError = false;
  let loading = true;
  let tempDisplay = localStorage.getItem('tempDisplay') || 'C';
  let showBanner = localStorage.getItem('showBanner') === 'false' ? false : true;
  let tooltipState = TOOLTIP_STATES.CLOSED;

  const toggleTempDisplay = () => {
    tempDisplay = tempDisplay == 'C' ? 'F' : 'C';
    localStorage.setItem('tempDisplay', tempDisplay);
  }

  const getSafecastDashboardLink = (deviceUID) => (
    `http://tt.safecast.org/dashboard/note:${deviceUID}`
  );

  const downloadData = () => {
    const csv = 'data:text/csv;charset=utf-8,' +
      unparse(readings);
    const encodedURI = encodeURI(csv);

    var link = document.createElement('a');
    link.setAttribute('href', encodedURI);
    link.setAttribute('download', 'airnote.csv');
    link.click();
  }

  const closeBanner = () => {
    showBanner = false;
    localStorage.setItem('showBanner', 'false');
  }

  onMount(() => {
    getReadings(deviceUID)
      .then(data => {
        lastReading = data.readings[0];
        if (!lastReading) {
          noDataError = true;
        } else {
          lastReading.heatIndex = getHeatIndex({
            temperature: toFahrenheit(lastReading.env_temp),
            humidity: lastReading.env_humid,
          });
          history = data.history;
          readings = data.readings;

          // This is a hack, but the speedometer plugin doesn’t give any
          // way to customize these labels.
          setTimeout(() => {
            var lastLabel = document.querySelector('text:last-child');
            if (lastLabel) {
              lastLabel.innerHTML = '250+';
            }
          });
        }
        loading = false;
      })
      .catch(err => {
        console.error(err);
        fetchError = true;
        loading = false;
      });
  });
</script>

<svelte:head>
  <title>Airnote Dashboard {lastReading ? '— ' + lastReading.device_sn : ''}</title>
</svelte:head>

<NotificationDisplay />

<div class="dashboard"
  style="opacity: {tooltipState !== TOOLTIP_STATES.CLOSED ? 0.3 : 1}">

  {#if loading}
    <div class="loading" />
  {/if}

  {#if noDataError}
    <div class="alert">
      <h4 class="alert-heading">{NO_DATA_ERROR_HEADING}</h4>
      <p>
        There is no recent data associated with this Airnote. If this is a new
        Airnote, it may take several hours for your device to report its first
        readings. For help setting up your Airnote, visit
        <a href='https://start.airnote.live'>start.airnote.live</a>.
      </p>

      <p>
        If this is a device that has previously reported readings, you can view
        historical data on
        <a href={getSafecastDashboardLink(deviceUID)}>this device’s Safecast dashboard</a>,
        and <a href="https://discuss.blues.io">reach out on our forum</a> if you need
        help getting your Airnote back up and running.
      </p>
    </div>
  {/if}

  {#if fetchError}
    <div class="alert">
      <h4 class="alert-heading">{FETCH_ERROR_HEADING}</h4>
      Please make sure your Airnote is online and connected before visiting
      this page. For help getting started, visit
      <a href="https://start.airnote.live" target="_new">start.airnote.live</a>.
    </div>
  {/if}

  {#if lastReading}
    {#if showBanner}
      <div class="banner" in:fade>
        <p>
          The Airnote is made in partnership with
          <a href="https://safecast.org/">Safecast</a>,
          a volunteer-centered organization devoted to open citizen
          science for environmental monitoring.
          <a href="https://safecast.org/donate/">Donate here</a>.
        </p>
        <button class="svg-button" on:click={closeBanner}>
          <CloseIcon />
        </button>
      </div>
    {/if}

    <div in:fade>
      <h2 class="air-quality-heading">
        <span>
          Air Quality {lastReading.loc_name ? 'in ' + lastReading.loc_name : ''}
          — {lastReading.device_sn}
        </span>
      </h2>

      <p class="provided-by">
        Courtesy of <a href="https://safecast.org/">Safecast</a>
      </p>

      <p class="last-update">
        Last Update:
        <span>
          {format(new Date(lastReading['@timestamp']),
            "MMMM dd yyyy 'at' h:mm aaa")}
        </span>
        <span class="actions">
          <button class="svg-button" on:click={downloadData}>
            <DownloadIcon />
          </button>
          <button class="svg-button" on:click={() => window.print()}>
            <PrintIcon />
          </button>
          <button class="svg-button" on:click={() => shareDashboard(deviceUID)}>
            <ShareIcon />
          </button>
        </span>
      </p>
    </div>

    <div class="all-measurements" in:fade>
      <div class="box speedometer-box">
        <h5>
          Air Quality Index
          <button class="svg-button info"
            on:click={() => tooltipState = TOOLTIP_STATES.AQI_HELP }>
            <InfoIcon />
          </button>
        </h5>
        <Speedometer aqi={lastReading.pms_aqi} />
      </div>

      <div class="box measurement-box">
        <div class="measurement-pm">
          <!--
          <div>
            <span>
              PM1
              <button class="svg-button info"
                on:click={() => tooltipState = TOOLTIP_STATES.PM01_0_HELP }>
                <InfoIcon />
              </button>
            </span>
            <span>
              <span
                title={Math.round(lastReading.pms_pm01_0)}
                class="circle"
                style="background-color: {getPM10Display(lastReading.pms_pm01_0)
                  .color}"
              />
            </span>
          </div>
          -->
          <div>
            <span>
              PM2.5
              <button class="svg-button info"
                on:click={() => tooltipState = TOOLTIP_STATES.PM02_5_HELP }>
                <InfoIcon />
              </button>
            </span>
            <span>
              <span
                title={Math.round(lastReading.pms_pm02_5)}
                class="circle"
                style="background-color: {getPM2_5Display(lastReading.pms_pm02_5)
                  .color}"
              />
            </span>
          </div>
          <div>
            <span>
              PM10
              <button class="svg-button info"
                on:click={() => tooltipState = TOOLTIP_STATES.PM10_0_HELP }>
                <InfoIcon />
              </button>
            </span>
            <span>
              <span
                title={Math.round(lastReading.pms_pm10_0)}
                class="circle"
                style="background-color: {getPM10Display(lastReading.pms_pm10_0)
                  .color}"
              />
            </span>
          </div>
        </div>

        <div class="measurement-air">
          <div>
            Temperature
            <strong>
              {
                tempDisplay == 'C' ? Math.round(lastReading.env_temp) + '°C' :
                Math.round(toFahrenheit(lastReading.env_temp)) + '°F'
              }
            </strong>
            <button on:click={toggleTempDisplay}>
              Change to °{tempDisplay == 'C' ? 'F' : 'C'}
            </button>
          </div>
          <div>
            Humidity
            <strong>{Math.round(lastReading.env_humid)}%</strong>
          </div>
          <div>
            Heat Index
            <strong>
              {
                tempDisplay == 'F' ? Math.round(lastReading.heatIndex) + '°F' :
                Math.round(toCelsius(lastReading.heatIndex)) + '°C'
              }
            </strong>
          </div>
          <div>
            Voltage
            <button class="svg-button info"
              on:click={() => tooltipState = TOOLTIP_STATES.VOLTAGE_HELP }>
              <InfoIcon />
            </button>
            <strong>
              {Number(lastReading.bat_voltage).toFixed(1)}V
            </strong>
          </div>
        </div>
      </div>
    </div>

    <div class="full-data-link">
      <a in:fade href="{getSafecastDashboardLink(deviceUID)}" class="svg-link" target="_blank">
        <span>View full data</span>
        <ExternalLinkIcon />
      </a>
    </div>

    <div class="box" in:fade>
      <History data={history} />
    </div>

    <Map lastReading={lastReading} />

    <div class="box" in:fade>
      <h3>Health Recommendations</h3>
      <Recommendation />
    </div>
  {/if}
</div>

{#if tooltipState !== TOOLTIP_STATES.CLOSED}
  <div class="tooltip">
    {#if tooltipState === TOOLTIP_STATES.PM01_0_HELP}
      <p>
        PM1.0 is particulate matter 1.0 microns and below. These particles typically 
        consist of dust, combustion particles, bacteria, and viruses.
      </p>
    {/if}
    {#if tooltipState === TOOLTIP_STATES.PM02_5_HELP}
      <p>
        PM2.5 is particulate matter 2.5 microns and below. These particles typically 
        consist of combustion particles, organic compounds, and metals.
      </p>
    {/if}
    {#if tooltipState === TOOLTIP_STATES.PM10_0_HELP}
      <p>
        PM10 is particulate matter 10 microns and below. These particles typically
        consist of dust, pollen, and mold.
      </p>
    {/if}
    {#if tooltipState === TOOLTIP_STATES.AQI_HELP}
      <p>
        Air Quality Index, or AQI, is the EPA’s index for reporting air quality.
        The higher the AQI value, the greater the level of air pollution and the
        greater the health concern.
      </p>
    {/if}
    {#if tooltipState === TOOLTIP_STATES.VOLTAGE_HELP}
      <p>
        The voltage level of the Airnote. Anything over 4 volts indicates the battery
        is full. If your Airnote is running low on battery, you may want to move your
        device to an area with more sunlight, or
        <a href="https://dev.blues.io/hardware/airnote-quickstart/#how-can-i-manually-charge-my-airnote">manually charge the device</a>.
      </p>
    {/if}
    <p>
      {#if tooltipState === TOOLTIP_STATES.PM02_5_HELP || tooltipState === TOOLTIP_STATES.PM10_0_HELP}
        <a href="https://www.epa.gov/pm-pollution/particulate-matter-pm-basics">
          Learn more
        </a>
      {/if}
      {#if tooltipState === TOOLTIP_STATES.AQI_HELP}
        <a href="https://www.airnow.gov/aqi/aqi-basics/">
          Learn more
        </a>
      {/if}
    </p>
    <button
      on:click={() => { tooltipState = TOOLTIP_STATES.CLOSED }}>
      Close
    </button>
  </div>
{/if}

<style>
  .dashboard {
    min-height: 200px;
    position: relative;
  }
  .banner {
    background: rgb(215, 229, 241);
    padding: 0.75rem 0.75rem;
    border-radius: 0.25rem;
    display: flex;
    margin-top: 1rem;
  }
  .banner p {
    margin: 0;
  }
  .banner button {
    margin-left: 0.5rem;
    min-width: 20px;
    align-self: center;
  }

  .air-quality-heading {
    margin-bottom: 0;
  }
  .provided-by, .last-update {
    font-size: 0.8rem;
    margin-top: 0.25rem;
    font-weight: 500;
  }
  .provided-by {
    color: rgb(166, 188, 207);
    margin-bottom: 0;
  }
  .last-update {
    color: rgb(69, 129, 172);
    display: flex;
  }
  .last-update span {
    color: rgb(166, 188, 207);
    font-weight: normal;
    padding-left: 0.25rem;
  }
  .actions {
    flex-grow: 1;
    text-align: right;
  }

  .all-measurements {
    display: flex;
  }
  .speedometer-box {
    margin: 0 1rem 0 0;
  }
  .speedometer-box h5 {
    margin: 0;
    text-align: center;
    position: relative;
    top: -0.5rem;
  }

  .measurement-box {
    flex-grow: 1;
    display: flex;
    padding: 0;
    margin: 0;
    flex-direction: column;
  }
  @media (max-width: 700px) {
    .all-measurements {
      display: block;
    }
    .speedometer-box, .measurement-box {
      margin: 1rem 0;
    }
  }
  @media (max-width: 400px) {
    .speedometer-box {
      padding-left: 0;
      padding-right: 0;
    }
  }
  .measurement-pm,
  .measurement-air {
    display: flex;
    text-align: center;
    padding: 1.9rem 0;
  }

  .measurement-air {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
  .measurement-pm > div,
  .measurement-air > div {
    flex-grow: 1;
    font-size: 0.8rem;
  }
  .measurement-air strong {
    display: block;
    font-size: 1.4rem;
  }
  .measurement-air button {
    background: none;
    color: var(--primary);
    padding: 0;
    font-size: 11px;
    border: none;
    box-shadow: none;
  }
  .circle {
    height: 20px;
    width: 20px;
    border-radius: 20px;
    display: block;
    margin: 10px auto 0 auto;
  }
  .full-data-link {
    margin-top: 0.5rem;
    overflow: auto;
  }
  .full-data-link a {
    font-size: 12px;
    display: flex;
    float: right;
  }
  .full-data-link span {
    display: inline-block;
    margin-right: 0.1rem;
  }

  .tooltip {
    position: fixed;
    top: 200px;
    left: 25%;
    width: 50%;
    background: white;
    padding: 2rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }
  @media (max-width: 700px) {
    .tooltip {
      top: 100px;
      left: 15%;
      width: 70%;
    }
  }
</style>
