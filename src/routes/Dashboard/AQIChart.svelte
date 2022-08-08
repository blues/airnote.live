<script>
  import { onMount } from "svelte";
  import { format, parseISO } from "date-fns";
  import { DATE_TIME_FORMAT_KEY } from "../../constants";
  import Chart from "chart.js/auto";

  export let readings;

  let aqiChart;
  let ctx;
  let aqiData = [];

  $: if (aqiChart) {
    aqiChart.data.datasets[0].data = aqiData;
    aqiChart.update();
  }

  const data = {
    datasets: [
      {
        label: "AQI",
        data: aqiData,
        fill: true,
        backgroundColor: "rgb(186, 104, 200, 0.5)",
        borderColor: "rgb(186, 104, 200)",
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
          text: "Air Quality Index",
        },
      },
    },
  };

  onMount(async () => {
    function getAQIData(readings) {
      aqiData = readings.map((reading) => {
        const d = parseISO(reading.captured, DATE_TIME_FORMAT_KEY);
        return {
          x: format(d, DATE_TIME_FORMAT_KEY),
          y: reading.aqi,
        };
      });
    }

    getAQIData(readings);

    aqiChart = new Chart(ctx, config);
  });
</script>

<canvas
  id="aqiChart"
  bind:this={ctx}
  width={420}
  height={300}
  data-cy="aqi-chart"
/>
