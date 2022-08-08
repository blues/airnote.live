<script>
  import { onMount } from "svelte";
  import { format, parseISO } from "date-fns";
  import { DATE_TIME_FORMAT_KEY } from "../../constants";
  import Chart from "chart.js/auto";

  export let readings;

  let humdityChart;
  let ctx;
  let humidityData = [];

  $: if (humdityChart) {
    humdityChart.data.datasets[0].data = humidityData;
    humdityChart.update();
  }

  const data = {
    datasets: [
      {
        label: "Humidity (%)",
        data: humidityData,
        fill: true,
        backgroundColor: "rgb(255, 126, 109, 0.5)",
        borderColor: "rgb(255, 126, 109)",
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
          text: "Humidity (%)",
        },
      },
    },
  };

  onMount(async () => {
    function getHumidityData(readings) {
      humidityData = readings.map((reading) => {
        const d = parseISO(reading.captured, DATE_TIME_FORMAT_KEY);
        return {
          x: format(d, DATE_TIME_FORMAT_KEY),
          y: parseFloat(reading.humidity).toFixed(2),
        };
      });
    }

    getHumidityData(readings);

    humdityChart = new Chart(ctx, config);
  });
</script>

<canvas
  id="humdityChart"
  bind:this={ctx}
  width={420}
  height={300}
  data-cy="humidity-chart"
/>
