<script>
  import { onMount } from "svelte";
  import { format, parseISO } from "date-fns";
  import { DATE_TIME_FORMAT_KEY } from "../../constants";
  import Chart from "chart.js/auto";

  export let readings;

  let pmChart;
  let ctx;
  let pm1Data = [];
  let pm2_5Data = [];
  let pm10Data = [];

  $: getPMData(readings);

  function getPMData(readings) {
    /* reading.captured comes in as something like 2022-08-22T06:27:38Z, 
    then parseISO() turns it into Mon Aug 22 2022 02:27:38 GMT-0400 (Eastern Daylight Time),
    and we take that date object and format() for the particular component (MM-dd HH:mm) */
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

  $: if (pmChart) {
    pmChart.data.datasets[0].data = pm1Data;
    pmChart.data.datasets[1].data = pm2_5Data;
    pmChart.data.datasets[2].data = pm10Data;
    pmChart.update();
  }

  const data = {
    datasets: [
      {
        label: "PM1 (μg/m³)",
        data: pm1Data,
        borderColor: "rgb(104, 159, 56)",
        backgroundColor: "rgb(104, 159, 56, 0.5)",
        tension: 0.1,
        borderWidth: 1,
      },
      {
        label: "PM2.5 (μg/m³)",
        data: pm2_5Data,
        borderColor: "rgb(89, 210, 255)",
        backgroundColor: "rgb(89, 210, 255, 0.5)",
        tension: 0.1,
        borderWidth: 1,
      },
      {
        label: "PM10 (μg/m³)",
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

  onMount(() => {
    pmChart = new Chart(ctx, config);
  });
</script>

<canvas
  id="pmChart"
  bind:this={ctx}
  width={420}
  height={300}
  data-cy="pm-chart"
/>
