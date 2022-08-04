<script>
  import { onMount } from "svelte";
  import { format, parseISO } from "date-fns";
  import { DATE_TIME_FORMAT_KEY } from "../../constants";
  import Chart from "chart.js/auto";

  export let readings;
  console.log(readings);

  let pmChart;
  let ctx;
  let pm1Data = [];
  let pm2_5Data = [];
  let pm10Data = [];

  $: if (pmChart) {
    pmChart.data.datasets[0].data = pm1Data;
    pmChart.data.datasets[1].data = pm2_5Data;
    pmChart.data.datasets[2].data = pm10Data;
    pmChart.update();
  }

  const data = {
    datasets: [
      {
        label: "PM1",
        data: pm1Data,
        borderColor: "rgb(104, 159, 56)",
        backgroundColor: "rgb(104, 159, 56, 0.5)",
        tension: 0.1,
        borderWidth: 1,
      },
      {
        label: "PM2.5",
        data: pm2_5Data,
        borderColor: "rgb(89, 210, 255)",
        backgroundColor: "rgb(89, 210, 255, 0.5)",
        tension: 0.1,
        borderWidth: 1,
      },
      {
        label: "PM10",
        data: pm10Data,
        borderColor: "rgb(255, 126, 109)",
        backgroundColor: "rgb(255, 126, 109, 0.5)",
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
          text: "Air Quality PM (μg/m³)",
        },
      },
    },
  };

  onMount(async () => {
    function getPMData(readings) {
      pm1Data = readings.map((reading) => {
        const d = parseISO(reading.captured, DATE_TIME_FORMAT_KEY);
        return {
          x: format(d, DATE_TIME_FORMAT_KEY),
          y: parseFloat(reading.pm01_0).toFixed(2),
        };
      });
      pm2_5Data = readings.map((reading) => {
        const d = parseISO(reading.captured, DATE_TIME_FORMAT_KEY);
        return {
          x: format(d, DATE_TIME_FORMAT_KEY),
          y: parseFloat(reading.pm02_5).toFixed(2),
        };
      });
      pm10Data = readings.map((reading) => {
        const d = parseISO(reading.captured, DATE_TIME_FORMAT_KEY);
        return {
          x: format(d, DATE_TIME_FORMAT_KEY),
          y: parseFloat(reading.pm10_0).toFixed(2),
        };
      });
    }

    getPMData(readings);

    pmChart = new Chart(ctx, config);
  });
</script>

<canvas id="pmChart" bind:this={ctx} width={420} height={300} />
