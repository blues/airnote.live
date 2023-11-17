<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { format, parseISO } from 'date-fns';
  import { toFahrenheit } from '../../services/air';
  import { DATE_TIME_FORMAT_KEY } from '../../constants';
  import Chart, {
    type ChartConfiguration,
    type ChartOptions
  } from 'chart.js/auto';
  import type { AirnoteReading } from '$lib/services/AirReadingModel';
  import type { ChartDataPointType } from '$lib/services/ChartModel';

  export let readings: AirnoteReading[] = [];
  export let tempDisplay: string = 'C';

  let temperatureChart: Chart<'line' | 'bar', ChartDataPointType[], unknown>;
  let ctx: HTMLCanvasElement;
  let tempDataCelsius: ChartDataPointType[] = [];
  let tempDataFahrenheit: ChartDataPointType[] = [];

  const dispatch = createEventDispatcher();

  $: if (readings) {
    getTempData(readings);
  }

  function getTempData(readings: AirnoteReading[]) {
    tempDataCelsius = readings.map((reading) => {
      const d = parseISO(reading.captured);
      return {
        x: format(d, DATE_TIME_FORMAT_KEY),
        y: reading.temperature
          ? parseFloat(reading.temperature.toString()).toFixed(2)
          : 0.0
      };
    });
    tempDataFahrenheit = readings.map((reading) => {
      const d = parseISO(reading.captured);
      return {
        x: format(d, DATE_TIME_FORMAT_KEY),
        y: reading.temperature
          ? parseFloat(toFahrenheit(reading.temperature).toString()).toFixed(2)
          : 0.0
      };
    });
  }

  const fetchTempChartDisplay = (tempDisplay: string) => {
    if (tempDisplay == 'C') {
      temperatureChart.data.datasets[0].data = tempDataCelsius;
      temperatureChart.data.datasets[1].data = [];
    } else if (tempDisplay == 'F') {
      temperatureChart.data.datasets[0].data = [];
      temperatureChart.data.datasets[1].data = tempDataFahrenheit;
    }
    tempDisplay = tempDisplay == 'C' ? 'F' : 'C';
    dispatch('change', tempDisplay);
    temperatureChart.update();
  };

  $: if (temperatureChart) {
    if (tempDisplay == 'C') {
      temperatureChart.data.datasets[0].data = tempDataCelsius;
      temperatureChart.data.datasets[1].data = [];
    } else if (tempDisplay == 'F') {
      temperatureChart.data.datasets[0].data = [];
      temperatureChart.data.datasets[1].data = tempDataFahrenheit;
    }
    temperatureChart.update();
  }

  const data = {
    datasets: [
      {
        label: 'Temperature (°C)',
        data: tempDataCelsius,
        fill: true,
        backgroundColor: 'rgb(89, 210, 255, 0.6)',
        borderColor: 'rgb(89, 210, 255)',
        tension: 0.1,
        borderWidth: 1
      },
      {
        label: 'Temperature (°F)',
        data: tempDataFahrenheit,
        fill: true,
        backgroundColor: 'rgb(255, 160, 0, 0.5)',
        borderColor: 'rgb(255, 160, 0)',
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
        text: 'Temperature'
      }
    }
  };

  const config: ChartConfiguration<'line', ChartDataPointType[], unknown> = {
    type: 'line',
    data: data,
    options: options
  };

  onMount(() => {
    temperatureChart = new Chart(ctx, config);
  });
</script>

<div class="chart-container">
  <canvas id="temperatureChart" bind:this={ctx} data-cy="temperature-chart" />
</div>
<div class="button-group">
  <button on:click={() => fetchTempChartDisplay(tempDisplay)}>
    Change to °{tempDisplay == 'C' ? 'F' : 'C'}
  </button>
</div>

<style>
  /* chart container div with relative positioning and `maintainAspectRatio: false 
  option required to update the canvas render and display sizes for responsiveness: 
  https://www.chartjs.org/docs/latest/configuration/responsive.html#important-note */
  .chart-container {
    position: relative;
    min-height: 300px;
    aspect-ratio: 1.4;
  }

  .button-group {
    margin-top: 0.5rem;
  }
</style>
