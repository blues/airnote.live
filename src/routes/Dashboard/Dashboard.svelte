<script>
  import { NotificationDisplay } from '@beyonk/svelte-notifications';
  import { format } from 'date-fns';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import Speedometer from 'svelte-speedometer';

  import ShareIcon from '../../icons/ShareIcon.svelte';
  import PrintIcon from '../../icons/PrintIcon.svelte';
  import History from './History.svelte';
  import Recommendation from './Recommendation.svelte';
  import {
    getAQIDisplay,
    getPM2_5Display,
    getPM10Display,
  } from '../../services/air';
  import { getReadings } from '../../services/device';
  import { shareDashboard } from '../../util/share';
  import { NO_DATA_ERROR_HEADING, FETCH_ERROR_HEADING } from '../../constants';

  export let deviceUID;

  let lastReading;
  let history;

  let noDataError = false;
  let fetchError = false;
  let loading = true;

  onMount(() => {
    getReadings(deviceUID)
      .then(data => {
        lastReading = data.readings[0];
        if (!lastReading) {
          noDataError = true;
        } else {
          lastReading.timestamp = new Date(lastReading['@timestamp']);
          history = data.history;

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
      .catch(() => {
        fetchError = true;
        loading = false;
      });
  });
</script>

<NotificationDisplay />
<p class="banner">
  Use this to highlight articles or news about Airnote.
  <a href="https://blues.io">And use this for a link</a>.
</p>

<h2 class="air-quality-heading">Air Quality</h2>

<div class="dashboard">
  {#if loading}
    <div class="loading" />
  {/if}

  {#if noDataError}
    <div class="alert">
      <h4 class="alert-heading">{NO_DATA_ERROR_HEADING}</h4>
      There is no data associated with this Airnote. If this is a new Airnote,
      it may take several hours for your device to report its first readings.
      For help setting up your Airnote, visit
      <a href='https://start.airnote.live'>start.airnote.live</a>.
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
    <p class="last-update" in:fade>
      Last Update:
      <span>
        {format(lastReading['timestamp'], "MMMM dd yyyy")} at
        {format(lastReading['timestamp'], "h:mm aaa")}
      </span>
      <span class="actions">
        <button class="svg-button" on:click={() => window.print()}>
          <PrintIcon />
        </button>
        <button class="svg-button" on:click={() => shareDashboard(deviceUID)}>
          <ShareIcon />
        </button>
      </span>
    </p>

    <div class="all-measurements" in:fade>
      <div class="box speedometer-box">
        <h5>Air Quality Index</h5>
        <Speedometer
          width={300}
          height={180}
          currentValueText=""
          needleHeightRatio={0.7}
          ringWidth={30}
          customSegmentStops={[0, 50, 100, 150, 200, 250]}
          segmentColors={['#00CC00', '#F8B52A', '#EB8A14', '#FF0000', '#A10649', '#7E0023']}
          maxValue={250}
          labelFontSize="12px"
          value={lastReading.pms_aqi > 250 ? 250 : lastReading.pms_aqi}
        />
        <div class="speedometer-value">
          {lastReading.pms_aqi}: {getAQIDisplay(lastReading.pms_aqi).text}
        </div>
      </div>

      <div class="box measurement-box">
        <div class="measurement-pm">
          <div>
            <span>PM2.5</span>
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
            <span>PM10</span>
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
            <strong>{Math.round(lastReading.env_temp)}°C</strong>
          </div>
          <div>
            Humidity
            <strong>{Math.round(lastReading.env_humid)}%</strong>
          </div>
          <div>
            Air Pressure
            <strong>
              {Math.round(lastReading.env_press / 1000)} kPa
            </strong>
          </div>
        </div>
      </div>
    </div>

    <div class="box" in:fade>
      <History data={history} />
    </div>

    <div class="box" in:fade>
      <h3>Health Recommendations</h3>
      <Recommendation />
    </div>
  {/if}
</div>

<style>
  .dashboard {
    min-height: 200px;
    position: relative;
  }
  .banner {
    background: rgb(215, 229, 241);
    padding: 0.75rem 0.75rem;
    border-radius: 0.25rem;
  }

  .air-quality-heading {
    margin-bottom: 0;
  }
  .last-update {
    display: flex;
    font-size: 0.8rem;
    margin-top: 0.25rem;
    color: rgb(69, 129, 172);
    font-weight: 500;
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
  h5 {
    margin: 0;
    text-align: center;
    position: relative;
    top: -0.75rem;
  }
  .speedometer-box {
    margin: 0 1rem 0 0;
    position: relative;
  }
  .speedometer-value {
    text-align: center;
    left: 0;
    bottom: 1.6rem;
    width: 100%;
    position: absolute;
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
  .measurement-pm {
    padding: 1rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .measurement-pm > div {
    padding: 0.65rem 2rem;
    display: flex;
  }
  .measurement-pm span {
    flex-grow: 1;
  }
  .measurement-pm span:last-child {
    text-align: right;
  }
  .measurement-air {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    text-align: center;
    padding: 1.25rem 0;
  }
  .measurement-air > div {
    flex-grow: 1;
    font-size: 0.8rem;
  }
  .measurement-air strong {
    display: block;
    font-size: 1.4rem;
  }
  .circle {
    height: 20px;
    width: 20px;
    border-radius: 20px;
    display: inline-block;
  }
</style>
