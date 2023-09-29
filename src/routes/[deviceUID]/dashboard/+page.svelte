<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { unparse } from 'papaparse';
	import { format } from 'date-fns';
	import { NotificationDisplay } from '@beyonk/svelte-notifications';

	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	import DownloadIcon from '$lib/icons/DownloadIcon.svelte';
	import InfoIcon from '$lib/icons/InfoIcon.svelte';
	import PrintIcon from '$lib/icons/PrintIcon.svelte';
	import ShareIcon from '$lib/icons/ShareIcon.svelte';

	import History from './History.svelte';
	import MapboxMap from './MapboxMap.svelte';
	import VoltageChart from '$lib/components/charts/VoltageChart.svelte';
	import TempChart from '$lib/components/charts/TempChart.svelte';
	import AQIChart from '$lib/components/charts/AQIChart.svelte';
	import HumidityChart from '$lib/components/charts/HumidityChart.svelte';
	import Recommendation from './Recommendation.svelte';
	import Speedometer from './Speedometer.svelte';
	import { APP_UID } from '$lib/constants';
	import PMChart from '$lib/components/charts/PMChart.svelte';
	import TOOLTIP_STATES from '$lib/constants/TooltipStates';
	import DATE_RANGE_OPTIONS from '$lib/constants/DateRangeOptions';
	import { shareDashboard } from '$lib/util/share';
	import { getCurrentDeviceFromUrl } from '$lib/services/device';
	import { convertDateRange, dateRangeDisplayText, filterEventsByDate } from '$lib/util/dates';
	import { getHeatIndex, toCelsius, toFahrenheit } from '$lib/services/air';
	import { ERROR_TYPE } from '$lib/constants/ErrorTypes';
	import type { AirnoteReading } from '$lib/services/AirReadingModel';
	import type { AirnoteHistoryReadings } from '$lib/services/AirHistoryModel';
	import { renderErrorMessage } from '$lib/util/errors';
	import type { AirnoteDevice } from '$lib/services/DeviceModel';

	export let deviceUID: string;

	let lastReading: AirnoteReading;
	let readings: AirnoteReading[] = [];
	let history: AirnoteHistoryReadings = {
		aqi: {},
		pm1_0: {},
		pm2_5: {},
		pm10_0: {}
	};
	let displayedReadings: AirnoteReading[];

	let error = false;
	let errorType: string;

	let tempDisplay: string = 'C';
	let showBanner: boolean = true;
	let tooltipState = TOOLTIP_STATES.CLOSED;
	let selectedDateRange = DATE_RANGE_OPTIONS.SEVEN_DAYS.displayText;

	let eventsUrl = `https://notehub.io/project/${APP_UID}/events`;

	$: if (deviceUID) {
		eventsUrl = `https://notehub.io/project/${APP_UID}/events?queryDevice=${deviceUID}`;
	}
	// data fetched from Notehub API via +page.server.ts on page load
	export let data;

	if (data && data.readings) {
		readings = data.readings;
	}

	if (data && data.history) {
		history = data.history;
	}

	if (!readings || readings.length === 0) {
		error = true;
		errorType = ERROR_TYPE.NO_DATA_ERROR;
	} else {
		lastReading = readings[0];

		lastReading.heatIndex = getHeatIndex({
			temperature: toFahrenheit(lastReading.temperature),
			humidity: lastReading.humidity
		});
	}

	$: if (selectedDateRange) {
		const convertedTimeframe = convertDateRange(selectedDateRange);
		displayedReadings = filterEventsByDate(readings, convertedTimeframe);
	}

	const toggleTempDisplay = () => {
		tempDisplay = tempDisplay == 'C' ? 'F' : 'C';
		localStorage.setItem('tempDisplay', tempDisplay);
	};

	function handleTempDisplayChange(event: { detail: string }) {
		tempDisplay = event.detail;
	}

	const downloadData = () => {
		const csv = 'data:text/csv;charset=utf-8,' + unparse(readings);
		const encodedURI = encodeURI(csv);

		var link = document.createElement('a');
		link.setAttribute('href', encodedURI);
		link.setAttribute('download', 'airnote.csv');
		link.click();
	};

	const closeBanner = () => {
		showBanner = false;
		localStorage.setItem('showBanner', 'false');
	};

	onMount(() => {
		const currentDevice: AirnoteDevice = getCurrentDeviceFromUrl(location);
		deviceUID = currentDevice.deviceUID ? currentDevice.deviceUID : '';
		tempDisplay = localStorage.getItem('tempDisplay') || 'C';
		showBanner = localStorage.getItem('showBanner') === 'false' ? false : true;
	});
</script>

<svelte:head>
	<title
		>Airnote Dashboard {lastReading?.serial_number ? '— ' + lastReading.serial_number : ''}</title
	>
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<NotificationDisplay />

<div class="dashboard" style="opacity: {tooltipState !== TOOLTIP_STATES.CLOSED ? 0.3 : 1}">
	{#if error}
		{@html renderErrorMessage(errorType, deviceUID)}
	{/if}

	{#if lastReading}
		<div class="air-quality-wrapper" in:fade>
			<h2 class="air-quality-heading" data-cy="dashboard-title">
				<span>
					Air Quality {lastReading.location ? 'in ' + lastReading.location : ''}
					{lastReading.serial_number ? '— ' + lastReading.serial_number : ''}
				</span>
			</h2>

			<div class="actions">
				<button class="svg-button" on:click={downloadData}>
					<DownloadIcon />
				</button>
				<button class="svg-button" on:click={() => window.print()}>
					<PrintIcon />
				</button>
				<button class="svg-button" on:click={() => shareDashboard(deviceUID)}>
					<ShareIcon />
				</button>
			</div>
		</div>

		<div class="all-measurements box" in:fade>
			<h3 class="current-readings-title">Current Reading</h3>
			<p class="last-update">
				Last Update:
				<span>
					{format(new Date(lastReading.captured), "MMMM dd yyyy 'at' h:mm aaa")}
				</span>
			</p>
			<div class="box speedometer-box">
				<h5>
					Air Quality Index
					<button class="svg-button info" on:click={() => (tooltipState = TOOLTIP_STATES.AQI_HELP)}>
						<InfoIcon />
					</button>
				</h5>
				<Speedometer aqi={lastReading.aqi} />
			</div>

			<div class="box measurement-box">
				<div class="measurement-pm" data-cy="measurement-pm">
					<div>
						<span>
							<strong>
								PM1
								<button
									class="svg-button info"
									on:click={() => (tooltipState = TOOLTIP_STATES.PM01_0_HELP)}
								>
									<InfoIcon />
								</button>
							</strong>
						</span>
						<div class="measurement-value">
							{Math.round(lastReading.pm01_0)}
						</div>
					</div>

					<div>
						<span>
							<strong>
								PM2.5
								<button
									class="svg-button info"
									on:click={() => (tooltipState = TOOLTIP_STATES.PM02_5_HELP)}
								>
									<InfoIcon />
								</button>
							</strong>
						</span>
						<div class="measurement-value">
							{Math.round(lastReading.pm02_5)}
						</div>
					</div>
					<div>
						<span>
							<strong>
								PM10
								<button
									class="svg-button info"
									on:click={() => (tooltipState = TOOLTIP_STATES.PM10_0_HELP)}
								>
									<InfoIcon />
								</button>
							</strong>
						</span>
						<div class="measurement-value">
							{Math.round(lastReading.pm10_0)}
						</div>
					</div>
				</div>

				<div class="measurement-air" data-cy="measurement-air">
					<div>
						<strong>Temperature</strong>
						<div class="measurement-value">
							{tempDisplay == 'C'
								? Math.round(lastReading.temperature) + '°C'
								: Math.round(toFahrenheit(lastReading.temperature)) + '°F'}
						</div>
						<button on:click={toggleTempDisplay}>
							Change to °{tempDisplay == 'C' ? 'F' : 'C'}
						</button>
					</div>
					<div>
						<strong>Humidity</strong>
						<div class="measurement-value">
							{Math.round(lastReading.humidity)}%
						</div>
					</div>
					<div>
						<strong>Heat Index</strong>
						<div class="measurement-value">
							{tempDisplay == 'F'
								? lastReading.heatIndex && Math.round(lastReading.heatIndex) + '°F'
								: lastReading.heatIndex && Math.round(toCelsius(lastReading.heatIndex)) + '°C'}
						</div>
					</div>
					<div>
						<strong>
							Voltage
							<button
								class="svg-button info"
								on:click={() => (tooltipState = TOOLTIP_STATES.VOLTAGE_HELP)}
							>
								<InfoIcon />
							</button>
						</strong>
						<div class="measurement-value">
							{Number(lastReading.voltage).toFixed(1)}V
						</div>
					</div>
				</div>
			</div>

			<p class="notehub-link">
				<a href={eventsUrl} target="_new" data-cy="notehub-link">
					View live Airnote events on Notehub.io
				</a>
			</p>

			<div class="map">
				<MapboxMap {lastReading} />
			</div>
		</div>

		<div class="box" in:fade>
			<History data={history} />
		</div>

		<div class="box" in:fade>
			<h3>Health Recommendations</h3>
			<Recommendation />
		</div>

		<h3>Historical Readings ({selectedDateRange})</h3>

		<div class="date-selector">
			<select bind:value={selectedDateRange} data-cy="chart-date-selector">
				{#each dateRangeDisplayText as dateRange}
					<option value={dateRange}>
						{dateRange}
					</option>
				{/each}
			</select>
		</div>

		<div class="all-charts">
			<div class="box chart1" in:fade>
				<VoltageChart readings={displayedReadings} />
			</div>

			<div class="box chart2" in:fade>
				<TempChart {tempDisplay} readings={displayedReadings} on:change={handleTempDisplayChange} />
			</div>

			<div class="box chart3" in:fade>
				<AQIChart readings={displayedReadings} />
			</div>

			<div class="box chart4" in:fade>
				<HumidityChart readings={displayedReadings} />
			</div>

			<div class="box chart5" in:fade>
				<PMChart readings={displayedReadings} />
			</div>
		</div>
		{#if showBanner}
			<div class="banner" in:fade>
				<p>
					The Airnote is made in partnership with
					<a href="https://safecast.org/">Safecast</a>, a volunteer-centered organization devoted to
					open citizen science for environmental monitoring.
					<a href="https://safecast.org/donate/">Donate here</a>.
				</p>
				<button class="svg-button" on:click={closeBanner}>
					<CloseIcon />
				</button>
			</div>
		{/if}
	{/if}
</div>

{#if tooltipState !== TOOLTIP_STATES.CLOSED}
	<div class="tooltip">
		{#if tooltipState === TOOLTIP_STATES.PM01_0_HELP}
			<p>
				PM1.0 is particulate matter 1.0 microns and below. These particles typically consist of
				dust, combustion particles, bacteria, and viruses.
			</p>
		{/if}
		{#if tooltipState === TOOLTIP_STATES.PM02_5_HELP}
			<p>
				PM2.5 is particulate matter 2.5 microns and below. These particles typically consist of
				combustion particles, organic compounds, and metals.
			</p>
		{/if}
		{#if tooltipState === TOOLTIP_STATES.PM10_0_HELP}
			<p>
				PM10 is particulate matter 10 microns and below. These particles typically consist of dust,
				pollen, and mold.
			</p>
		{/if}
		{#if tooltipState === TOOLTIP_STATES.AQI_HELP}
			<p>
				Air Quality Index, or AQI, is the EPA’s index for reporting air quality. The higher the AQI
				value, the greater the level of air pollution and the greater the health concern.
			</p>
		{/if}
		{#if tooltipState === TOOLTIP_STATES.VOLTAGE_HELP}
			<p>
				The voltage level of the Airnote. Anything over 4 volts indicates the battery is full. If
				your Airnote is running low on battery, you may want to move your device to an area with
				more sunlight, or
				<a
					href="https://dev.blues.io/hardware/airnote-quickstart/#how-can-i-manually-charge-my-airnote"
					>manually charge the device</a
				>.
			</p>
		{/if}
		<p>
			{#if tooltipState === TOOLTIP_STATES.PM02_5_HELP || tooltipState === TOOLTIP_STATES.PM10_0_HELP}
				<a href="https://www.epa.gov/pm-pollution/particulate-matter-pm-basics"> Learn more </a>
			{/if}
			{#if tooltipState === TOOLTIP_STATES.AQI_HELP}
				<a href="https://www.airnow.gov/aqi/aqi-basics/"> Learn more </a>
			{/if}
		</p>
		<button
			on:click={() => {
				tooltipState = TOOLTIP_STATES.CLOSED;
			}}
		>
			Close
		</button>
	</div>
{/if}

<style>
	.dashboard {
		min-height: 200px;
		position: relative;
	}

	.box {
		border: 1px solid var(--lightestGray);
		background: var(--white);
		border-radius: 5px;
		padding: 1.5rem;
		margin: 1rem 0;
	}

	.box h3 {
		margin-top: 0;
	}

	.banner {
		background: var(--bannerBlue);
		padding: 0.75rem 0.75rem;
		border-radius: 0.25rem;
		display: flex;
		margin-top: 1rem;
	}
	.banner p {
		margin: 0;
	}
	.banner button {
		margin-left: 0.5rem;
		min-width: 20px;
		align-self: center;
	}

	.air-quality-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.last-update {
		font-size: 0.8rem;
		margin-top: 0.25rem;
		font-weight: 500;
		color: var(--steelBlue);
		display: flex;
		grid-area: last-update;
	}
	.last-update span {
		color: var(--lighterSteelBlue);
		font-weight: normal;
		padding-left: 0.25rem;
	}
	.actions {
		flex-grow: 1;
		text-align: right;
	}

	.all-measurements {
		display: grid;
		grid-template-areas:
			'title title'
			'last-update last-update'
			'speedometer all-measurements'
			'notehub-link notehub-link'
			'map map';
	}

	.current-readings-title {
		grid-area: title;
		margin-bottom: 0;
	}

	.notehub-link {
		grid-area: notehub-link;
		margin-bottom: 0;
	}

	.map {
		grid-area: map;
	}
	.speedometer-box {
		margin: 0 1rem 0 0;
		grid-area: speedometer;
	}
	.speedometer-box h5 {
		margin: 0;
		text-align: center;
		position: relative;
		top: -0.5rem;
		font-size: 1.1rem;
	}

	.measurement-box {
		flex-grow: 1;
		display: flex;
		padding: 0;
		margin: 0;
		flex-direction: column;
		justify-content: space-around;
		grid-area: all-measurements;
	}

	.measurement-value {
		font-size: 1.2rem;
	}

	.date-selector {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
	}

	.date-selector select {
		margin-bottom: 0.5rem;
		height: inherit;
	}

	.all-charts {
		display: grid;
		grid-template-areas:
			'chart1 chart2'
			'chart3 chart4'
			'chart5 chart5';
		column-gap: 0.5rem;
	}

	.chart1,
	.chart2,
	.chart3,
	.chart4 {
		max-width: 475px;
	}

	.chart1 {
		grid-area: chart1;
	}

	.chart2 {
		grid-area: chart2;
	}

	.chart3 {
		grid-area: chart3;
	}

	.chart4 {
		grid-area: chart4;
	}

	.chart5 {
		grid-area: chart5;
	}

	@media (max-width: 1000px) {
		.all-charts {
			display: block;
			max-width: 700px;
			margin: auto;
		}

		.chart1,
		.chart2,
		.chart3,
		.chart4,
		.chart5 {
			max-width: initial;
		}
	}

	@media (max-width: 780px) {
		.date-selector {
			grid-template-columns: repeat(2, 1fr);
		}
		.all-measurements,
		.all-charts {
			display: block;
		}
		.speedometer-box,
		.measurement-box {
			margin: 1rem 0;
		}
	}
	@media (max-width: 400px) {
		.speedometer-box {
			padding-left: 0;
			padding-right: 0;
		}
	}
	.measurement-pm,
	.measurement-air {
		display: flex;
		text-align: center;
		padding: 3rem 0;
	}

	.measurement-air {
		border-top: 1px solid var(--lightestGray);
	}
	.measurement-pm > div,
	.measurement-air > div {
		flex-grow: 1;
	}
	.measurement-air strong,
	.measurement-pm strong {
		display: block;
		font-weight: 600;
	}
	.measurement-air button {
		background: none;
		color: var(--primaryBlue);
		padding: 0;
		font-size: 11px;
		border: none;
		box-shadow: none;
	}

	.tooltip {
		position: fixed;
		top: 200px;
		left: 25%;
		width: 50%;
		background: var(--white);
		padding: 2rem;
		border: 1px solid var(--lightestGray);
		border-radius: 5px;
	}
	@media (max-width: 700px) {
		.tooltip {
			top: 100px;
			left: 15%;
			width: 70%;
		}

		@media (max-width: 376px) {
			.air-quality-wrapper {
				display: block;
			}

			.box {
				padding: 1.5rem 0.5rem;
			}
		}
	}
</style>
