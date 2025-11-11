<script lang="ts">
  import { onMount } from 'svelte';
  import { format } from 'date-fns/format';
  import { DATE_TIME_FORMAT_KEY } from '$lib/constants';
  import Chart, {
    type ChartConfiguration,
    type ChartOptions
  } from 'chart.js/auto';
  import 'chartjs-adapter-date-fns';
  import type { AirnoteReading } from '$lib/services/AirReadingModel';
  import type { ChartDataPointType } from '$lib/services/ChartModel';

  export let readings: AirnoteReading[] = [];
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;

  let humdityChart: Chart<'line', ChartDataPointType[], unknown>;
  let ctx: HTMLCanvasElement;
  let humidityData: ChartDataPointType[] = [];

  $: if (readings) {
    getHumidityData(readings);
  }

  function getHumidityData(readings: AirnoteReading[]) {
    humidityData = readings.map((reading) => {
      const d = reading.captured * 1000;
      return {
        x: d,
        y: reading.humidity
          ? parseFloat(reading.humidity.toString()).toFixed(2)
          : 0.0
      };
    });
  }

  $: if (humdityChart) {
    humdityChart.data.datasets[0].data = humidityData;
    humdityChart.options = options as any;
    humdityChart.update();
  }

  const data = {
    datasets: [
      {
        label: 'Humidity (%)',
        data: humidityData,
        fill: true,
        backgroundColor: 'rgb(255, 126, 109, 0.5)',
        borderColor: 'rgb(255, 126, 109)',
        tension: 0.1,
        borderWidth: 1
      }
    ]
  };

  $: options = ({
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          displayFormats: {
            minute: DATE_TIME_FORMAT_KEY
          }
        },
        ticks: {
          maxTicksLimit: 10
        },
        ...(min !== undefined && { min }),
        ...(max !== undefined && { max })
      }
    },
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Humidity (%)'
      },
      tooltip: {
        callbacks: {
          title: function (context: any) {
            return format(context[0].parsed.x, DATE_TIME_FORMAT_KEY);
          }
        }
      }
    }
  }) as ChartOptions<'line'>;

  const config: ChartConfiguration<'line', ChartDataPointType[], unknown> = {
    type: 'line',
    data: data,
    options: options
  };

  onMount(() => {
    humdityChart = new Chart(ctx, config);
  });
</script>

<div class="chart-container">
  <canvas id="humdityChart" bind:this={ctx} data-cy="humidity-chart" />
</div>
