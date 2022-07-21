<script>
  import { onMount } from "svelte";
  import { format, parseISO } from "date-fns";

  import { DATE_TIME_FORMAT_KEY } from "../../constants";
  import Chart from "chart.js/auto";

  let voltageChart;
  let ctx;
  let voltageData = [];

  $: if (voltageChart && voltageData) {
    voltageChart.data.datasets[0].data = voltageData;
    voltageChart.update();
  }

  const data = {
    datasets: [
      {
        label: "Voltage",
        data: voltageData,
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(75, 192, 192, 0.5)",
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
        y: {
          min: 3.8,
          max: 4.2,
        },
      },
      borderRadius: "30",
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Battery Voltage (V) with Charging Indicator",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = `Current Voltage: ${parseFloat(context.raw.y).toFixed(
                2
              )}V. Currently charging? ${context.raw.charging}`;
              return label;
            },
          },
        },
      },
    },
  };

  onMount(async () => {
    function getVoltageData(readings) {
      voltageData = readings.reverse().map((reading) => {
        const d = parseISO(reading.captured, DATE_TIME_FORMAT_KEY);
        return {
          x: format(d, DATE_TIME_FORMAT_KEY),
          y: reading.voltage,
          charging: reading.charging ? true : false,
        };
      });
    }
    getVoltageData(readings);

    // Initialize chart using default config set
    voltageChart = new Chart(ctx, config);
  });

  export let readings;
</script>

<canvas id="voltageChart" bind:this={ctx} width={400} height={200} />
