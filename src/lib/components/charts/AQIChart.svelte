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

  let aqiChart: Chart<'line', ChartDataPointType[], unknown>;
  let ctx: HTMLCanvasElement;
  let aqiData: ChartDataPointType[] = [];

  $: if (readings) {
    getAQIData(readings);
  }

  function getAQIData(readings: AirnoteReading[]) {
    aqiData = readings.map((reading) => {
      const d = reading.captured * 1000;
      return {
        x: d,
        y: reading.aqi
      };
    });
  }

  $: if (aqiChart) {
    aqiChart.data.datasets[0].data = aqiData;
    aqiChart.update();
  }

  $: if (aqiChart && (min !== undefined || max !== undefined)) {
    aqiChart.options = options as any;
    aqiChart.update();
  }

  const data = {
    datasets: [
      {
        label: 'AQI',
        data: aqiData,
        fill: true,
        backgroundColor: 'rgb(186, 104, 200, 0.5)',
        borderColor: 'rgb(186, 104, 200)',
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
        text: 'Air Quality Index'
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
    aqiChart = new Chart(ctx, config);
  });
</script>

<div class="chart-container">
  <canvas id="aqiChart" bind:this={ctx} data-cy="aqi-chart" />
</div>
