<script lang="ts">
	import { onMount } from 'svelte';
	import { format, parseISO } from 'date-fns';
	import { DATE_TIME_FORMAT_KEY } from '$lib/constants';
	import Chart, { type ChartConfiguration, type ChartOptions } from 'chart.js/auto';
	import type { AirnoteReading } from '$lib/services/AirReadingModel';
	import type { ChartDataPointType } from '$lib/services/ChartModel';

	export let readings: AirnoteReading[] = [];

	let aqiChart: Chart<'line', ChartDataPointType[], unknown>;
	let ctx: HTMLCanvasElement;
	let aqiData: ChartDataPointType[] = [];

	$: if (readings) {
		getAQIData(readings);
	}

	function getAQIData(readings: AirnoteReading[]) {
		aqiData = readings.map((reading) => {
			const d = parseISO(reading.captured);
			return {
				x: format(d, DATE_TIME_FORMAT_KEY),
				y: reading.aqi
			};
		});
	}

	$: if (aqiChart) {
		aqiChart.data.datasets[0].data = aqiData;
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

	const options: ChartOptions<'line'> = {
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
				text: 'Air Quality Index'
			}
		}
	};

	const config: ChartConfiguration<'line', ChartDataPointType[], unknown> = {
		type: 'line',
		data: data,
		options: options
	};

	onMount(() => {
		aqiChart = new Chart(ctx, config);
	});
</script>

<canvas id="aqiChart" bind:this={ctx} width={420} height={300} data-cy="aqi-chart" />
