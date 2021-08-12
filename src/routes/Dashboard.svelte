<script>
  import { format } from 'date-fns';
  import { getReadings } from '../services/device';
  import Spinner from '../util/Spinner.svelte';

  export let deviceUID;

  let lastAirReading;
  let lastAqReading;
  let lastUpdated;
  // Hardcoded for now
  let aqi = 50;
  let aqiDescription = 'Moderate';

  getReadings(deviceUID)
    .then(data => {
      lastAirReading = data.airReadings[0];
      lastAqReading = data.aqReadings[0];
      lastUpdated = data.lastUpdated;
    });
</script>

<h2>Welcome back!</h2>

<p class="fun-fact">
  Fun fact: I have absolutely no idea what to put in this box! 
  <a href="https://blues.io">Read more</a>.
</p>

<h2 class="air-quality-heading">Your Air Quality</h2>

<div class="dashboard">
  {#if !lastUpdated || lastUpdated}
    <Spinner />
  {/if}

  <div class="dashboard-content">
    {#if lastUpdated}
      <p class="last-update">
        Last Update: 
        <span>
          {format(lastUpdated, 'MMMM dd yyyy')} at 
          {format(lastUpdated, 'h:mm aaa')}
        </span>
      </p>

      <div class="all-measurements">
        <div class="aqi-box">
          <div>Air Quality Index</div>
          <div class="aqi-value">{aqi}</div>
          <div class="aqi-description">{aqiDescription}</div>
        </div>
    
        <div class="measurement-box">
          <div class="measurement-pm">
            <div>
              <span>PM2.5</span>
              <span>{lastAqReading.pm02_5}</span>
            </div>
            <div>
              <span>PM10</span>
              <span>{lastAqReading.pm10_0}</span>
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
    {/if}
  </div>
</div>

<style>
  .fun-fact {
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
  .aqi-box, .measurement-box {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }
  .aqi-box {
    background: rgb(248, 181, 42);
    color: white;
    text-align: center;
    padding: 2rem;
    margin-right: 1rem;
    width: 8rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .aqi-value {
    font-size: 3rem;
    letter-spacing: 0.1rem;
    font-weight: bold;
  }
  .measurement-box {
    background: white;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  .measurement-pm {
    padding: 1rem;
    flex-grow: 1;
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
    padding: 0.75rem 0;
  }
  .measurement-air > div {
    flex-grow: 1;
    font-size: 0.8rem;
  }
  .measurement-air strong {
    display: block;
    font-size: 1.4rem;
  }
</style>