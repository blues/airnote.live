<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { format, parseISO } from "date-fns";
  import { toFahrenheit } from "../../services/air";
  import { DATE_TIME_FORMAT_KEY } from "../../constants";
  import Chart from "chart.js/auto";

  export let readings;
  export let tempDisplay;

  let temperatureChart;
  let ctx;
  let tempDataCelsius = [];
  let tempDataFahrenheit = [];

  const dispatch = createEventDispatcher();

  $: if (readings) {
    getTempData(readings);
  }

  function getTempData(readings) {
    tempDataCelsius = readings.map((reading) => {
      const d = parseISO(reading.captured, DATE_TIME_FORMAT_KEY);
      return {
        x: format(d, DATE_TIME_FORMAT_KEY),
        y: parseFloat(reading.temperature).toFixed(2),
      };
    });
    tempDataFahrenheit = readings.map((reading) => {
      const d = parseISO(reading.captured, DATE_TIME_FORMAT_KEY);
      return {
        x: format(d, DATE_TIME_FORMAT_KEY),
        y: parseFloat(toFahrenheit(reading.temperature)).toFixed(2),
      };
    });
  }

  const fetchTempChartDisplay = (tempDisplay) => {
    if (tempDisplay == "C") {
      temperatureChart.data.datasets[0].data = tempDataCelsius;
      temperatureChart.data.datasets[1].data = [];
    } else if (tempDisplay == "F") {
      temperatureChart.data.datasets[0].data = [];
      temperatureChart.data.datasets[1].data = tempDataFahrenheit;
    }
    tempDisplay = tempDisplay == "C" ? "F" : "C";
    dispatch("change", tempDisplay);
    temperatureChart.update();
  };

  $: if (temperatureChart) {
    if (tempDisplay == "C") {
      temperatureChart.data.datasets[0].data = tempDataCelsius;
      temperatureChart.data.datasets[1].data = [];
    } else if (tempDisplay == "F") {
      temperatureChart.data.datasets[0].data = [];
      temperatureChart.data.datasets[1].data = tempDataFahrenheit;
    }
    temperatureChart.update();
  }

  const data = {
    datasets: [
      {
        label: "Temperature (°C)",
        data: tempDataCelsius,
        fill: true,
        backgroundColor: "rgb(89, 210, 255, 0.6)",
        borderColor: "rgb(89, 210, 255)",
        tension: 0.1,
        borderWidth: 1,
      },
      {
        label: "Temperature (°F)",
        data: tempDataFahrenheit,
        fill: true,
        backgroundColor: "rgb(255, 160, 0, 0.5)",
        borderColor: "rgb(255, 160, 0)",
        tension: 0.1,
        borderWidth: 1,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      scales: {
        x: {
          ticks: {
            maxTicksLimit: 10,
          },
        },
      },
      borderRadius: "30",
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Temperature",
        },
      },
    },
  };

  onMount(() => {
    temperatureChart = new Chart(ctx, config);
  });
</script>

<canvas
  id="temperatureChart"
  bind:this={ctx}
  width={420}
  height={300}
  data-cy="temperature-chart"
/>
<div class="button-group">
  <button on:click={() => fetchTempChartDisplay(tempDisplay)}>
    Change to °{tempDisplay == "C" ? "F" : "C"}
  </button>
</div>

<style>
  .button-group {
    margin-top: 0.5rem;
  }
</style>
