<script>
  import { getReadings } from '../services/device';

  export let deviceUID;

  let air;
  let aq;
  let lastUpdate;

  getReadings(deviceUID)
    .then(data => {
      air = data.air[0];
      aq = data.aq[0];
    });
</script>

{#if !air}
  <!--<Spinner />-->
{/if}

<h2>Welcome back!</h2>

<p class="fun-fact">
  Fun fact: I have absolutely no idea what to put in this box! 
  <a href="https://blues.io">Read more</a>.
</p>

<h2 class="air-quality-heading">Your Air Quality</h2>
{#if air}
  <p class="last-update">Last Update: <span>{lastUpdate}</span></p>
  <ul>
    <li>Humidity: {air.humid}</li>
    <li>Air Pressure: {air.press}</li>
    <li>Temperature: {air.temp}</li>
    <li>PM1: {aq.pm01_0}</li>
    <li>PM2.5: {aq.pm02_5}</li>
    <li>PM10: {aq.pm10_0}</li>
  </ul>
{/if}

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
    color: rgb(70, 124, 162);
    font-weight: 500;
  }
  .last-update span {
    color: rgb(166, 188, 207);
    font-weight: normal;
  }

</style>