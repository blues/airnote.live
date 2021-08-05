<script>
  import { getReadings } from '../services/device';
  import { Spinner } from 'sveltestrap';

  export let location;
  export let deviceUID;

  let air;
  let aq;

  getReadings(deviceUID)
    .then(data => {
      air = data.air[0];
      aq = data.aq[0];
    });
</script>

{#if !air}
  <Spinner />
{/if}

{#if air}
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

</style>