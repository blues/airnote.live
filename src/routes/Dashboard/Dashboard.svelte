<script>
  import { NotificationDisplay } from "@beyonk/svelte-notifications";
  import { format } from "date-fns";
  import { unparse } from "papaparse";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  import CloseIcon from "../../icons/CloseIcon.svelte";
  import DownloadIcon from "../../icons/DownloadIcon.svelte";
  import InfoIcon from "../../icons/InfoIcon.svelte";
  import ShareIcon from "../../icons/ShareIcon.svelte";
  import PrintIcon from "../../icons/PrintIcon.svelte";

  import History from "./History.svelte";
  import MapboxMap from "./MapboxMap.svelte";
  import VoltageChart from "../../components/charts/VoltageChart.svelte";
  import TempChart from "../../components/charts/TempChart.svelte";
  import AQIChart from "../../components/charts/AQIChart.svelte";
  import PMChart from "../../components/charts/PMChart.svelte";
  import HumidityChart from "../../components/charts/HumidityChart.svelte";
  import Recommendation from "./Recommendation.svelte";
  import Speedometer from "./Speedometer.svelte";
  import TOOLTIP_STATES from "./TooltipStates";
  import { getHeatIndex, toFahrenheit, toCelsius } from "../../services/air";
  import { getReadings } from "../../services/device";
  import { shareDashboard } from "../../util/share";
  import { NO_DATA_ERROR_HEADING, FETCH_ERROR_HEADING } from "../../constants";

  export let deviceUID;

  let lastReading;
  let readings;
  let history;

  let noDataError = false;
  let fetchError = false;
  let loading = true;

  let tempDisplay = localStorage.getItem("tempDisplay") || "C";
  let showBanner =
    localStorage.getItem("showBanner") === "false" ? false : true;
  let tooltipState = TOOLTIP_STATES.CLOSED;

  const toggleTempDisplay = () => {
    tempDisplay = tempDisplay == "C" ? "F" : "C";
    localStorage.setItem("tempDisplay", tempDisplay);
  };

  function handleTempDisplayChange(ev) {
    tempDisplay = ev.detail;
  }

  const downloadData = () => {
    const csv = "data:text/csv;charset=utf-8," + unparse(readings);
    const encodedURI = encodeURI(csv);

    var link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "airnote.csv");
    link.click();
  };

  const closeBanner = () => {
    showBanner = false;
    localStorage.setItem("showBanner", "false");
  };

  onMount(() => {
    getReadings(deviceUID)
      .then((data) => {
        lastReading = data.readings[0];
        if (!lastReading) {
          noDataError = true;
        } else {
          lastReading.heatIndex = getHeatIndex({
            temperature: toFahrenheit(lastReading.temperature),
            humidity: lastReading.humidity,
          });
          history = data.history;
          readings = data.readings;
        }
        loading = false;
      })
      .catch((err) => {
        console.error(err);
        fetchError = true;
        loading = false;
      });
  });
</script>

<svelte:head>
  <title
    >Airnote Dashboard {lastReading?.serial_number
      ? "— " + lastReading.serial_number
      : ""}</title
  >
</svelte:head>

<NotificationDisplay />

<div
  class="dashboard"
  style="opacity: {tooltipState !== TOOLTIP_STATES.CLOSED ? 0.3 : 1}"
>
  {#if loading}
    <div class="loading" />
  {/if}

  {#if noDataError}
    <div class="alert">
      <h4 class="alert-heading">{NO_DATA_ERROR_HEADING}</h4>
      <p>
        This Airnote has not reported data in the last seven days. If this is a
        new Airnote, it may take several hours for your device to report its
        first readings. For help setting up your Airnote, visit
        <a href="https://start.airnote.live">start.airnote.live</a>.
      </p>

      <p>
        If this is a device that has previously reported readings, you can <a
          href="https://discuss.blues.io">reach out on our forum</a
        > if you need help getting your Airnote back up and running.
      </p>
    </div>
  {/if}

  {#if fetchError}
    <div class="alert">
      <h4 class="alert-heading">{FETCH_ERROR_HEADING}</h4>
      Please make sure your Airnote is online and connected before visiting this
      page. For help getting started, visit
      <a href="https://start.airnote.live" target="_new">start.airnote.live</a>.
    </div>
  {/if}

  {#if lastReading}
    {#if showBanner}
      <div class="banner" in:fade>
        <p>
          The Airnote is made in partnership with
          <a href="https://safecast.org/">Safecast</a>, a volunteer-centered
          organization devoted to open citizen science for environmental
          monitoring.
          <a href="https://safecast.org/donate/">Donate here</a>.
        </p>
        <button class="svg-button" on:click={closeBanner}>
          <CloseIcon />
        </button>
      </div>
    {/if}

    <div class="air-quality-wrapper" in:fade>
      <h2 class="air-quality-heading" data-cy="dashboard-title">
        <span>
          Air Quality {lastReading.location ? "in " + lastReading.location : ""}
          {lastReading.serial_number ? "—" + lastReading.serial_number : ""}
        </span>
      </h2>

      <div class="actions">
        <button class="svg-button" on:click={downloadData}>
          <DownloadIcon />
        </button>
        <button class="svg-button" on:click={() => window.print()}>
          <PrintIcon />
        </button>
        <button class="svg-button" on:click={() => shareDashboard(deviceUID)}>
          <ShareIcon />
        </button>
      </div>
    </div>

    <div class="all-measurements box" in:fade>
      <h3 class="current-readings-title">Current Reading</h3>
      <p class="last-update">
        Last Update:
        <span>
          {format(new Date(lastReading.captured), "MMMM dd yyyy 'at' h:mm aaa")}
        </span>
      </p>
      <div class="box speedometer-box">
        <h5>
          Air Quality Index
          <button
            class="svg-button info"
            on:click={() => (tooltipState = TOOLTIP_STATES.AQI_HELP)}
          >
            <InfoIcon />
          </button>
        </h5>
        <Speedometer aqi={lastReading.aqi} />
      </div>

      <div class="box measurement-box">
        <div class="measurement-pm" data-cy="measurement-pm">
          <div>
            <span>
              PM1
              <button
                class="svg-button info"
                on:click={() => (tooltipState = TOOLTIP_STATES.PM01_0_HELP)}
              >
                <InfoIcon />
              </button>
            </span>
            <div>
              <strong>{Math.round(lastReading.pm01_0)}</strong>
            </div>
          </div>

          <div>
            <span>
              PM2.5
              <button
                class="svg-button info"
                on:click={() => (tooltipState = TOOLTIP_STATES.PM02_5_HELP)}
              >
                <InfoIcon />
              </button>
            </span>
            <div>
              <strong>{Math.round(lastReading.pm02_5)}</strong>
            </div>
          </div>
          <div>
            <span>
              PM10
              <button
                class="svg-button info"
                on:click={() => (tooltipState = TOOLTIP_STATES.PM10_0_HELP)}
              >
                <InfoIcon />
              </button>
            </span>
            <div>
              <strong>{Math.round(lastReading.pm10_0)}</strong>
            </div>
          </div>
        </div>

        <div class="measurement-air" data-cy="measurement-air">
          <div>
            Temperature
            <strong>
              {tempDisplay == "C"
                ? Math.round(lastReading.temperature) + "°C"
                : Math.round(toFahrenheit(lastReading.temperature)) + "°F"}
            </strong>
            <button on:click={toggleTempDisplay}>
              Change to °{tempDisplay == "C" ? "F" : "C"}
            </button>
          </div>
          <div>
            Humidity
            <strong>{Math.round(lastReading.humidity)}%</strong>
          </div>
          <div>
            Heat Index
            <strong>
              {tempDisplay == "F"
                ? Math.round(lastReading.heatIndex) + "°F"
                : Math.round(toCelsius(lastReading.heatIndex)) + "°C"}
            </strong>
          </div>
          <div>
            Voltage
            <button
              class="svg-button info"
              on:click={() => (tooltipState = TOOLTIP_STATES.VOLTAGE_HELP)}
            >
              <InfoIcon />
            </button>
            <strong>
              {Number(lastReading.voltage).toFixed(1)}V
            </strong>
          </div>
        </div>
      </div>
      <div class="map">
        <MapboxMap {lastReading} />
      </div>
    </div>

    <div class="box" in:fade>
      <History data={history} />
    </div>

    <div class="box" in:fade>
      <h3>Health Recommendations</h3>
      <Recommendation />
    </div>

    <h3>Historical Readings (Last 7 Days)</h3>

    <div class="all-charts">
      <div class="box chart1" in:fade>
        <VoltageChart {readings} />
      </div>

      <div class="box chart2" in:fade>
        <TempChart
          {tempDisplay}
          {readings}
          on:change={handleTempDisplayChange}
        />
      </div>

      <div class="box chart3" in:fade>
        <AQIChart {readings} />
      </div>

      <div class="box chart4" in:fade><HumidityChart {readings} /></div>

      <div class="box chart5" in:fade>
        <PMChart {readings} />
      </div>
    </div>
  {/if}
</div>

{#if tooltipState !== TOOLTIP_STATES.CLOSED}
  <div class="tooltip">
    {#if tooltipState === TOOLTIP_STATES.PM01_0_HELP}
      <p>
        PM1.0 is particulate matter 1.0 microns and below. These particles
        typically consist of dust, combustion particles, bacteria, and viruses.
      </p>
    {/if}
    {#if tooltipState === TOOLTIP_STATES.PM02_5_HELP}
      <p>
        PM2.5 is particulate matter 2.5 microns and below. These particles
        typically consist of combustion particles, organic compounds, and
        metals.
      </p>
    {/if}
    {#if tooltipState === TOOLTIP_STATES.PM10_0_HELP}
      <p>
        PM10 is particulate matter 10 microns and below. These particles
        typically consist of dust, pollen, and mold.
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
        The voltage level of the Airnote. Anything over 4 volts indicates the
        battery is full. If your Airnote is running low on battery, you may want
        to move your device to an area with more sunlight, or
        <a
          href="https://dev.blues.io/hardware/airnote-quickstart/#how-can-i-manually-charge-my-airnote"
          >manually charge the device</a
        >.
      </p>
    {/if}
    <p>
      {#if tooltipState === TOOLTIP_STATES.PM02_5_HELP || tooltipState === TOOLTIP_STATES.PM10_0_HELP}
        <a href="https://www.epa.gov/pm-pollution/particulate-matter-pm-basics">
          Learn more
        </a>
      {/if}
      {#if tooltipState === TOOLTIP_STATES.AQI_HELP}
        <a href="https://www.airnow.gov/aqi/aqi-basics/"> Learn more </a>
      {/if}
    </p>
    <button
      on:click={() => {
        tooltipState = TOOLTIP_STATES.CLOSED;
      }}
    >
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

  .air-quality-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .last-update {
    font-size: 0.8rem;
    margin-top: 0.25rem;
    font-weight: 500;
    color: rgb(69, 129, 172);
    display: flex;
    grid-area: last-update;
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
    display: grid;
    grid-template-areas:
      "title title"
      "last-update last-update"
      "speedometer all-measurements"
      "map map";
  }

  .current-readings-title {
    grid-area: title;
    margin-bottom: 0;
  }

  .map {
    grid-area: map;
  }
  .speedometer-box {
    margin: 0 1rem 0 0;
    grid-area: speedometer;
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
    justify-content: space-around;
    grid-area: all-measurements;
  }

  .all-charts {
    display: grid;
    grid-template-areas:
      "chart1 chart2"
      "chart3 chart4"
      "chart5 chart5";
    column-gap: 0.5rem;
  }

  .chart1,
  .chart2,
  .chart3,
  .chart4 {
    max-width: 475px;
  }

  .chart1 {
    grid-area: chart1;
  }

  .chart2 {
    grid-area: chart2;
  }

  .chart3 {
    grid-area: chart3;
  }

  .chart4 {
    grid-area: chart4;
  }

  .chart5 {
    grid-area: chart5;
  }

  @media (max-width: 1000px) {
    .all-charts {
      display: block;
      max-width: 700px;
      margin: auto;
    }

    .chart1,
    .chart2,
    .chart3,
    .chart4,
    .chart5 {
      max-width: initial;
    }
  }

  @media (max-width: 780px) {
    .all-measurements,
    .all-charts {
      display: block;
    }
    .speedometer-box,
    .measurement-box {
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
    padding: 3rem 0;
  }

  .measurement-air {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
  .measurement-pm > div,
  .measurement-air > div {
    flex-grow: 1;
    font-size: 0.8rem;
  }
  .measurement-air strong,
  .measurement-pm strong {
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

    @media (max-width: 376px) {
      .air-quality-wrapper {
        display: block;
      }

      .box {
        padding: 1.5rem 0.5rem;
      }
    }
  }
</style>
