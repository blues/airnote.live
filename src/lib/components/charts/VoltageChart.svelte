<script lang="ts">
	import { onMount } from 'svelte';
	import { format, parseISO } from 'date-fns';
	import { DATE_TIME_FORMAT_KEY } from '$lib/constants';
	import Chart, { type ChartConfiguration, type ChartOptions, type ChartData } from 'chart.js/auto';
	import type { AirnoteReading } from '$lib/services/AirReadingModel';
	import type { ChartDataPointType } from '$lib/services/ChartModel';

	export let readings: AirnoteReading[] = [];

	let voltageChart: Chart<'line' | 'bar', ChartDataPointType[], unknown>;
	let ctx: HTMLCanvasElement;
	let voltageData: ChartDataPointType[] = [];
	let chargingData: ChartDataPointType[] = [];

	/* this gives a bar the height of the chart to indicate
  if an Airnote was charging during the time period */
	const MAX_VOLTAGE = 6;

	$: if (readings) {
		getVoltageData(readings);
	}

	function getVoltageData(readings: AirnoteReading[]) {
		voltageData = readings.reverse().map((reading) => {
			const d = parseISO(reading.captured);
			return {
				x: format(d, DATE_TIME_FORMAT_KEY),
				y: parseFloat(reading.voltage.toString()).toFixed(2)
			};
		});
		chargingData = readings
			.filter((reading) => reading.charging)
			.map((reading) => {
				const d = parseISO(reading.captured);
				return {
					x: format(d, DATE_TIME_FORMAT_KEY),
					y: MAX_VOLTAGE,
					voltage: parseFloat(reading.voltage.toString()).toFixed(2)
				};
			});
	}

	$: if (voltageChart) {
		voltageChart.data.datasets[0].data = voltageData;
		voltageChart.data.datasets[1].data = chargingData;
		voltageChart.update();
	}

	const data: ChartData<'line' | 'bar', ChartDataPointType[], unknown> = {
		datasets: [
			{
				label: 'Voltage (V)',
				data: voltageData,
				fill: true,
				borderColor: 'rgb(104, 159, 56)',
				backgroundColor: 'rgb(104, 159, 56, 0.5)',
				tension: 0.1,
				borderWidth: 1
			},
			{
				label: 'Charging',
				data: chargingData,
				backgroundColor: 'rgb(255, 224, 130, 0.6)',
				type: 'bar',
				categoryPercentage: 1.0,
				barPercentage: 1.0
			}
		]
	};

	const options: ChartOptions<'line'> = {
		scales: {
			x: {
				ticks: {
					maxTicksLimit: 10
				}
			},
			y: {
				min: 2.5,
				max: 5.5
			}
		},
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: 'Battery Voltage (V) with Charging Indicator'
			},
			tooltip: {
				callbacks: {
					// too much of a pain to make tooltips and labels TS compatible
					label: function (context: any) {
						let label = context.dataset.label || '';
						if (label === 'Charging') {
							label = `Voltage (V): ${context.raw.voltage}`;
						} else {
							label = `Voltage (V): ${context.raw.y}`;
						}
						return label;
					}
				}
			}
		}
	};

	const config: ChartConfiguration<'line' | 'bar', ChartDataPointType[], unknown> = {
		type: 'line',
		data: data,
		options: options
	};

	onMount(() => {
		// Initialize chart using default config set
		voltageChart = new Chart(ctx, config);
	});
</script>

<canvas id="voltageChart" bind:this={ctx} width={420} height={300} data-cy="voltage-chart" />
