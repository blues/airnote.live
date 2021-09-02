<script>
  import Speedometer from 'svelte-speedometer';
  import { getAQIDisplay } from '../../services/air';

  export let lastReading;
</script>

<h5>Air Quality Index</h5>
<div class="speedometer-container">
  <Speedometer
    width={300}
    height={180}
    currentValueText=""
    needleHeightRatio={0.8}
    ringWidth={30}
    customSegmentStops={[0, 50, 100, 150, 200, 250]}
    segmentColors={['#00CC00', '#F8B52A', '#EB8A14', '#FF0000', '#A10649', '#7E0023']}
    maxValue={250}
    needleColor="black"
    labelFontSize="12px"
    value={lastReading.pms_aqi > 250 ? 250 : lastReading.pms_aqi}
  />
  <div class="speedometer-value" style="background-color: {getAQIDisplay(lastReading.pms_aqi).color}">
    <div>{lastReading.pms_aqi}</div>
    <div>{getAQIDisplay(lastReading.pms_aqi).text}</div>
  </div>
</div>

<style>
  h5 {
    margin: 0;
    text-align: center;
    position: relative;
    top: -0.75rem;
  }
  .speedometer-container {
    position: relative;
    width: 300px;
    margin: 0 auto;
  }
  .speedometer-value {
    text-align: center;
    left: 68px;
    bottom: 30px;
    position: absolute;
    color: white;
    height: 83px;
    width: 166px;
    border-top-left-radius: 166px;
    border-top-right-radius: 166px;
    border: 2px solid black;
  }
  .speedometer-value div:first-child {
    font-size: 2.3rem;
    margin-top: 3px;
  }
  .speedometer-value div:last-child {
    margin: block;
    margin-top: -7px;
  }
  .speedometer-value::before {
    width: 260px;
    height: 2px;
    background: black;
    content: '';
    position: absolute;
    left: -50px;
    top: 79px;
  }
  .speedometer-value::after {
    width: 260px;
    height: 5px;
    background: white;
    content: '';
    position: absolute;
    left: -50px;
    top: 81px;
  }
</style>