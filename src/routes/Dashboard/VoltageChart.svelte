<script>
  import { onMount } from "svelte";
  import { format, parseISO } from "date-fns";

  import { DATE_TIME_FORMAT_KEY } from "../../constants";
  import Chart from "chart.js/auto";

  let voltageChart;
  let ctx;
  let voltageData = [];
  let chargingData = [];

  $: if (voltageChart && voltageData && chargingData) {
    voltageChart.data.datasets[0].data = voltageData;
    voltageChart.data.datasets[1].data = chargingData;
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
      {
        label: "Charging",
        data: chargingData,
        fill: true,
        backgroundColor: "rgb(255,255,0,0.4)",
        type: "bar",
        categoryPercentage: 1.0,
        barPercentage: 1.0,
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
              let label;
              if (context.dataset.label === "Charging") {
                label = `Current voltage (V): ${context.raw.voltage}`;
              } else {
                label = `Current Voltage (V): ${context.raw.y}`;
              }
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
          y: parseFloat(reading.voltage).toFixed(2),
        };
      });
      chargingData = readings
        .filter((reading) => reading.charging)
        .map((reading) => {
          const d = parseISO(reading.captured, DATE_TIME_FORMAT_KEY);
          return {
            x: format(d, DATE_TIME_FORMAT_KEY),
            y: 5,
            voltage: parseFloat(reading.voltage).toFixed(2),
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
