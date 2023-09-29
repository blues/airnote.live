<script lang="ts">
	import { onMount } from 'svelte';
	import { format, parseISO } from 'date-fns';
	import { DATE_TIME_FORMAT_KEY } from '$lib/constants';
	import Chart, { type ChartConfiguration, type ChartOptions } from 'chart.js/auto';
	import type { AirnoteReading } from '$lib/services/AirReadingModel';
	import type { ChartDataPointType } from '$lib/services/ChartModel';

	export let readings: AirnoteReading[] = [];

	let humdityChart: Chart<'line', ChartDataPointType[], unknown>;
	let ctx: HTMLCanvasElement;
	let humidityData: ChartDataPointType[] = [];

	$: if (readings) {
		getHumidityData(readings);
	}

	function getHumidityData(readings: AirnoteReading[]) {
		humidityData = readings.map((reading) => {
			const d = parseISO(reading.captured);
			return {
				x: format(d, DATE_TIME_FORMAT_KEY),
				y: parseFloat(reading.humidity.toString()).toFixed(2)
			};
		});
	}

	$: if (humdityChart) {
		humdityChart.data.datasets[0].data = humidityData;
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
				text: 'Humidity (%)'
			}
		}
	};

	const config: ChartConfiguration<'line', ChartDataPointType[], unknown> = {
		type: 'line',
		data: data,
		options: options
	};

	onMount(() => {
		humdityChart = new Chart(ctx, config);
	});
</script>

<canvas id="humdityChart" bind:this={ctx} width={420} height={300} data-cy="humidity-chart" />
