<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { format, parseISO } from 'date-fns';
	import { toFahrenheit } from '../../services/air';
	import { DATE_TIME_FORMAT_KEY } from '../../constants';
	import Chart, { type ChartConfiguration, type ChartOptions } from 'chart.js/auto';
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
				y: parseFloat(reading.temperature.toString()).toFixed(2)
			};
		});
		tempDataFahrenheit = readings.map((reading) => {
			const d = parseISO(reading.captured);
			return {
				x: format(d, DATE_TIME_FORMAT_KEY),
				y: parseFloat(toFahrenheit(reading.temperature).toString()).toFixed(2)
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

<canvas
	id="temperatureChart"
	bind:this={ctx}
	width={420}
	height={300}
	data-cy="temperature-chart"
/>
<div class="button-group">
	<button on:click={() => fetchTempChartDisplay(tempDisplay)}>
		Change to °{tempDisplay == 'C' ? 'F' : 'C'}
	</button>
</div>

<style>
	.button-group {
		margin-top: 0.5rem;
	}
</style>
