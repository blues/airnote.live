<script>
  import { onMount } from "svelte";
  import { format, parseISO } from "date-fns";
  import { toFahrenheit } from "../../services/air";
  import { DATE_TIME_FORMAT_KEY } from "../../constants";
  import Chart from "chart.js/auto";

  let temperatureChart;
  let ctx;
  let tempDataCelsius = [];
  let tempDataFahrenheit = [];
  let tempChartDisplay = "C";

  const fetchTempChartDisplay = (tempChartDisplay) => {
    if (tempChartDisplay == "C") {
      temperatureChart.data.datasets[0].data = tempDataCelsius;
      temperatureChart.data.datasets[1].data = [];
    } else if (tempChartDisplay == "F") {
      temperatureChart.data.datasets[0].data = [];
      temperatureChart.data.datasets[1].data = tempDataFahrenheit;
    }
    tempChartDisplay = tempChartDisplay == "C" ? "F" : "C";
    temperatureChart.update();
  };

  $: if (temperatureChart) {
    // todo DRY this up with the func above? I couldn't make it work properly
    if (tempChartDisplay == "C") {
      temperatureChart.data.datasets[0].data = tempDataCelsius;
      temperatureChart.data.datasets[1].data = [];
    } else if (tempChartDisplay == "F") {
      temperatureChart.data.datasets[0].data = [];
      temperatureChart.data.datasets[1].data = tempDataFahrenheit;
    }
    tempChartDisplay = tempChartDisplay == "C" ? "F" : "C";
    temperatureChart.update();
  }

  const data = {
    datasets: [
      {
        label: "Temperature (°C)",
        data: tempDataCelsius,
        fill: true,
        backgroundColor: "rgba(90,181,242,0.2)",
        borderColor: "rgba(179,181,198,1)",
        tension: 0.1,
      },
      {
        label: "Temperature (°F)",
        data: tempDataFahrenheit,
        fill: true,
        backgroundColor: "rgb(255, 99, 132, 0.5)",
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
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

  onMount(async () => {
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

    getTempData(readings);

    temperatureChart = new Chart(ctx, config);
  });

  export let readings;
</script>

<canvas id="temperatureChart" bind:this={ctx} width={400} height={200} />
<div class="button-group">
  <button on:click={() => fetchTempChartDisplay(tempChartDisplay)}>
    Change to °{tempChartDisplay == "C" ? "C" : "F"}
  </button>
</div>
