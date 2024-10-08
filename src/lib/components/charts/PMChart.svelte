<script lang="ts">
  import { onMount } from 'svelte';
  import { format } from 'date-fns';
  import { DATE_TIME_FORMAT_KEY } from '$lib/constants';
  import Chart, {
    type ChartConfiguration,
    type ChartData,
    type ChartOptions
  } from 'chart.js/auto';
  import type { AirnoteReading } from '$lib/services/AirReadingModel';
  import type { ChartDataPointType } from '$lib/services/ChartModel';

  export let readings: AirnoteReading[] = [];

  let pmChart: Chart<'line', ChartDataPointType[], unknown>;
  let ctx: HTMLCanvasElement;
  let pm1Data: ChartDataPointType[] = [];
  let pm2_5Data: ChartDataPointType[] = [];
  let pm10Data: ChartDataPointType[] = [];

  $: if (readings) {
    getPMData(readings);
  }

  function getPMData(readings: AirnoteReading[]) {
    pm1Data = readings.map((reading) => {
      const d = reading.captured * 1000;
      return {
        x: format(d, DATE_TIME_FORMAT_KEY),
        y: reading.pm01_0
          ? parseFloat(reading.pm01_0.toString()).toFixed(2)
          : 0.0
      };
    });
    pm2_5Data = readings.map((reading) => {
      const d = reading.captured * 1000;
      return {
        x: format(d, DATE_TIME_FORMAT_KEY),
        y: reading.pm02_5
          ? parseFloat(reading.pm02_5.toString()).toFixed(2)
          : 0.0
      };
    });
    pm10Data = readings.map((reading) => {
      const d = reading.captured * 1000;
      return {
        x: format(d, DATE_TIME_FORMAT_KEY),
        y: reading.pm10_0
          ? parseFloat(reading.pm10_0.toString()).toFixed(2)
          : 0.0
      };
    });
  }

  $: if (pmChart) {
    pmChart.data.datasets[0].data = pm1Data;
    pmChart.data.datasets[1].data = pm2_5Data;
    pmChart.data.datasets[2].data = pm10Data;
    pmChart.update();
  }

  const data: ChartData<'line', ChartDataPointType[], unknown> = {
    datasets: [
      {
        label: 'PM1 (μg/m³)',
        data: pm1Data,
        borderColor: 'rgb(104, 159, 56)',
        backgroundColor: 'rgb(104, 159, 56, 0.5)',
        tension: 0.1,
        borderWidth: 1
      },
      {
        label: 'PM2.5 (μg/m³)',
        data: pm2_5Data,
        borderColor: 'rgb(89, 210, 255)',
        backgroundColor: 'rgb(89, 210, 255, 0.5)',
        tension: 0.1,
        borderWidth: 1
      },
      {
        label: 'PM10 (μg/m³)',
        data: pm10Data,
        borderColor: 'rgb(255, 126, 109)',
        backgroundColor: 'rgb(255, 126, 109, 0.5)',
        tension: 0.1,
        borderWidth: 1
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 10
        }
      }
    },
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Air Quality PM (μg/m³)'
      }
    }
  };

  const config: ChartConfiguration<'line', ChartDataPointType[], unknown> = {
    type: 'line',
    data: data,
    options: options
  };

  onMount(() => {
    pmChart = new Chart(ctx, config);
  });
</script>

<div class="chart-container">
  <canvas id="pmChart" bind:this={ctx} data-cy="pm-chart" />
</div>
