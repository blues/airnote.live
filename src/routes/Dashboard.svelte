<script>
  import { format } from 'date-fns';
  import { fade } from 'svelte/transition';
  import Speedometer from 'svelte-speedometer';

  import Recommendation from '../components/Recommendation.svelte';
  import {
    getAQIDisplay,
    getPM2_5Display,
    getPM10Display,
  } from '../services/air';
  import { getReadings } from '../services/device';

  export let deviceUID;

  let lastAirReading;
  let lastAqReading;
  let lastUpdated;

  // Hardcoded for now
  let aqi = 55;

  getReadings(deviceUID).then((data) => {
    lastAirReading = data.airReadings[0];
    lastAqReading = data.aqReadings[0];
    lastUpdated = data.lastUpdated;
  });
</script>

<p class="banner">
  Use this to highlight articles or news about Airnote.
  <a href="https://blues.io">And use this for a link</a>.
</p>

<h2 class="air-quality-heading">Air Quality</h2>

<div class="dashboard">
  {#if !lastUpdated}
    <div class="loading" />
  {/if}

  {#if lastUpdated}
    <p class="last-update" in:fade>
      Last Update:
      <span>
        {format(lastUpdated, "MMMM dd yyyy")} at
        {format(lastUpdated, "h:mm aaa")}
      </span>
    </p>

    <div class="all-measurements" in:fade>
      <div class="box speedometer-box">
        <h5>Air Quality Index</h5>
        <Speedometer
          height={180}
          currentValueText=""
          needleHeightRatio={0.7}
          ringWidth={30}
          customSegmentStops={[0, 50, 100, 150, 200, 300]}
          segmentColors={['#00CC00', '#F8B52A', '#EB8A14', '#FF0000', '#A10649', '#7E0023']}
          maxValue={300}
          labelFontSize="12px"
          value={aqi > 300 ? 300 : aqi}
        />
        <div class="speedometer-value">
          {aqi}: {getAQIDisplay(aqi).text}
        </div>
      </div>
      <!--
      <div class="aqi-box" style="background-color: {getAQIDisplay(aqi).color}">
        <div>Air Quality Index</div>
        <div class="aqi-value">{aqi}</div>
        <div class="aqi-description">
          {getAQIDisplay(aqi).text}
        </div>
      </div>
      -->

      <div class="box measurement-box">
        <div class="measurement-pm">
          <div>
            <span>PM2.5</span>
            <span>
              <span
                class="circle"
                style="background-color: {getPM2_5Display(lastAqReading.pm02_5)
                  .color}"
              />
            </span>
          </div>
          <div>
            <span>PM10</span>
            <span>
              <span
                class="circle"
                style="background-color: {getPM10Display(lastAqReading.pm10_0)
                  .color}"
              />
            </span>
          </div>
        </div>

        <div class="measurement-air">
          <div>
            Temperature
            <strong>{lastAirReading.temp}°C</strong>
          </div>
          <div>
            Humidity
            <strong>{lastAirReading.humid}%</strong>
          </div>
          <div>
            Air Pressure
            <strong>{lastAirReading.press}</strong>
          </div>
        </div>
      </div>
    </div>

    <div class="box" in:fade>
      <h3>Air Quality Index (Last 7 Days)</h3>
      <div class="aqi-history">
        <div class="day-1">
          <span>Thursday<br />August 12th</span>
          <div
            class="aqi-box"
            style="background-color: {getAQIDisplay(54).color}"
          >
            <div class="aqi-value">54</div>
            <div class="aqi-description">{getAQIDisplay(54).text}</div>
          </div>
        </div>
        <div class="day-2">
          <span>Wednesday<br />August 11th</span>
          <div
            class="aqi-box"
            style="background-color: {getAQIDisplay(20).color}"
          >
            <div class="aqi-value">20</div>
            <div class="aqi-description">{getAQIDisplay(20).text}</div>
          </div>
        </div>
        <div class="day-3">
          <span>Tuesday<br />August 10th</span>
          <div
            class="aqi-box"
            style="background-color: {getAQIDisplay(120).color}"
          >
            <div class="aqi-value">120</div>
            <div class="aqi-description">{getAQIDisplay(120).text}</div>
          </div>
        </div>
        <div class="day-4">
          <span>Monday<br />August 9th</span>
          <div
            class="aqi-box"
            style="background-color: {getAQIDisplay(157).color}"
          >
            <div class="aqi-value">157</div>
            <div class="aqi-description">{getAQIDisplay(157).text}</div>
          </div>
        </div>
        <div class="day-5">
          <span>Sunday<br />August 8th</span>
          <div
            class="aqi-box"
            style="background-color: {getAQIDisplay(207).color}"
          >
            <div class="aqi-value">207</div>
            <div class="aqi-description">{getAQIDisplay(207).text}</div>
          </div>
        </div>
        <div class="day-6">
          <span>Saturday<br />August 7th</span>
          <div
            class="aqi-box"
            style="background-color: {getAQIDisplay(398).color}"
          >
            <div class="aqi-value">398</div>
            <div class="aqi-description">{getAQIDisplay(398).text}</div>
          </div>
        </div>
        <div class="day-7">
          <span>Friday<br />August 6th</span>
          <div
            class="aqi-box"
            style="background-color: {getAQIDisplay(22).color}"
          >
            <div class="aqi-value">22</div>
            <div class="aqi-description">{getAQIDisplay(22).text}</div>
          </div>
        </div>
      </div>
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
    font-size: 0.8rem;
    margin-top: 0.25rem;
    color: rgb(69, 129, 172);
    font-weight: 500;
  }
  .last-update span {
    color: rgb(166, 188, 207);
    font-weight: normal;
  }
  .all-measurements {
    display: flex;
  }
  .box {
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: white;
    border-radius: 5px;
    padding: 1.5rem;
    margin: 1rem 0;
  }
  .box h3 {
    margin-top: 0;
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
    position: relative;
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

  .aqi-history {
    display: flex;
    text-align: center;
    font-size: 0.8rem;
  }
  .aqi-history > div {
    flex-grow: 1;
    flex-basis: 0;
  }
  .aqi-history .aqi-box {
    padding: 0 0 0.25rem 0;
    margin: 0.75em 1.5em 0 1.5em;
    color: white;
    border-radius: 5px;
  }
  .aqi-history .aqi-value {
    font-weight: 500;
    font-size: 2em;
  }
  .aqi-history .aqi-description {
    font-size: 0.8rem;
  }

  .loading {
    display: inline-block;
    width: 50px;
    height: 50px;
    border: 3px solid rgb(70, 124, 162);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s linear infinite;
    position: absolute;
    top: 50%;
    left: 50%;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
