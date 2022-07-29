<script>
  import Speedometer from "svelte-speedometer";
  import { getAQIDisplay, aqiLegend } from "../../services/air";

  export let aqi;

  let segmentLegend = aqiLegend;
</script>

<div class="speedometer-container">
  <Speedometer
    width={300}
    height={180}
    currentValueText=""
    needleHeightRatio={0.8}
    ringWidth={30}
    customSegmentStops={[0, 50, 100, 150, 200, 250, 300]}
    segmentColors={[
      "#8FD2AD",
      "#F8E890",
      "#FEBB68",
      "#D76E81",
      "#9467D2",
      "#7E4B4B",
    ]}
    maxValue={300}
    needleColor="black"
    labelFontSize="12px"
    value={aqi > 300 ? 300 : aqi}
  />
  <div
    class="speedometer-value"
    style="background-color: {getAQIDisplay(aqi).color}"
  >
    <div>{aqi}</div>
    <div class={(aqi >= 100) & (aqi < 150) ? "small" : ""}>
      {getAQIDisplay(aqi).text}
    </div>
  </div>
</div>
<div class="speedometer-legend">
  {#each aqiLegend as item}
    <div class="legend-item">
      <span class="circle" style="background-color: {item.color}" />
      <span style="text-align: center">{item.text}</span>
    </div>
  {/each}
</div>

<style>
  .speedometer-legend {
    display: flex;
  }

  .legend-item {
    inline-size: 70px;
    overflow-wrap: break-word;
    font-size: 0.8rem;
    display: flex;
    flex-direction: column;
  }

  .circle {
    height: 20px;
    width: 20px;
    border-radius: 20px;
    display: block;
    margin: 10px auto 0 auto;
  }
  .speedometer-container {
    position: relative;
    width: 300px;
    margin: 0 auto;
    top: 5px;
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
    border: 1px solid rgb(166, 188, 207);
  }
  .speedometer-value div:first-child {
    font-size: 2.3rem;
    margin-top: 3px;
  }
  .speedometer-value div:last-child {
    margin-top: -7px;
  }
  .speedometer-value div.small {
    font-size: 0.7rem;
    width: 100px;
    margin: 0 auto;
    top: -10px;
    position: relative;
  }
  .speedometer-value::before {
    width: 260px;
    height: 1px;
    background: rgb(166, 188, 207);
    content: "";
    position: absolute;
    left: -49px;
    top: 80px;
  }
  .speedometer-value::after {
    width: 260px;
    height: 10px;
    background: white;
    content: "";
    position: absolute;
    left: -50px;
    top: 81px;
  }
</style>
