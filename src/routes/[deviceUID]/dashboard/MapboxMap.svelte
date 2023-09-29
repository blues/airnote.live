<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { format, parseISO } from 'date-fns';
	import { aqiColors, aqiRanges, getAQIColor } from '$lib/services/air';
	import { DATE_TIME_KEY } from '$lib/constants';
	import mapboxgl from 'mapbox-gl';
	import type { AirnoteReading } from '$lib/services/AirReadingModel';

	export let lastReading: AirnoteReading;

	let map;
	let airnoteMarker;
	let markerColor;
	let zoom = 10;
	let popup;
	let mapboxToken =
		'pk.eyJ1IjoicGFpZ2VuMTEiLCJhIjoiY2lyemJlZ3A0MDBqZTJ5cGs5ZHJicjI2YyJ9.2-dZqM-k2obDN47BpWq5Lw';

	onMount(() => {
		mapboxgl.accessToken = mapboxToken;
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [lastReading.lon, lastReading.lat],
			zoom
		});

		aqiRanges.forEach((layer, i: number) => {
			const color = aqiColors[i];
			const item = document.createElement('div');
			const key = document.createElement('span');
			const legend: HTMLElement | null = document.getElementById('legend');
			item.className = 'legend-wrapper';
			item.style.display = 'flex';
			item.style.alignItems = 'center';
			key.className = 'legend-key';
			key.style.background = color;
			key.style.height = '15px';
			key.style.width = '15px';
			key.style.marginRight = '8px';

			const value = document.createElement('span');
			value.innerHTML = `${layer}`;
			item.appendChild(key);
			item.appendChild(value);
			if (legend) {
				legend.appendChild(item);
			}
		});

		const d = parseISO(lastReading.captured);

		popup = new mapboxgl.Popup().setHTML(
			`<p style="text-align: center; margin:0">${format(d, DATE_TIME_KEY)}</p>
      <h3 style="margin: 0">Device ID: ${lastReading.device_uid}</h3>
      <p style="margin: 0; display: flex; justify-content: space-between"><span class="mapboxgl-pm">AQI:</span> ${Math.round(
				lastReading.aqi
			)}</p>
      <p style="margin: 0; display: flex; justify-content: space-between"><span class="mapboxgl-pm">PM1.0:</span> ${Math.round(
				lastReading.pm01_0
			)} μg/m³</p>
      <p style="margin: 0; display: flex; justify-content: space-between"><span class="mapboxgl-pm">PM2.5:</span> ${Math.round(
				lastReading.pm02_5
			)} μg/m³</p>
      <p style="margin: 0; display: flex; justify-content: space-between"><span class="mapboxgl-pm">PM10.0:</span> ${Math.round(
				lastReading.pm10_0
			)} μg/m³</p>`
		);

		markerColor = getAQIColor(lastReading.aqi);

		airnoteMarker = new mapboxgl.Marker({ color: markerColor })
			.setLngLat([lastReading.lon, lastReading.lat])
			.setPopup(popup)
			.addTo(map);

		map.scrollZoom.disable();
	});
</script>

{#if lastReading.lon && lastReading.lat}
	<div in:fade>
		<div class="map-heading">
			<h3 style="margin-top: 1rem">Map</h3>
		</div>
		<div class="map-wrapper">
			<div id="map" data-cy="map" style="height:320px;max-width:960px" />
			<div id="legend" class="map-overlay">AQI Levels</div>
		</div>
	</div>
{/if}

<style>
	.map-heading {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.map-wrapper {
		display: grid;
	}

	#map {
		grid-area: 1 / 1;
	}

	.map-overlay {
		background: var(--white);
		z-index: 2;
		border-radius: 3px;
		grid-area: 1 / 1;
		width: 110px;
		height: 185px;
		margin: auto 0 15px 15px;
		padding: 10px 0 0 10px;
		font-weight: 600;
	}

	:global(.mapboxgl-popup) {
		z-index: 3;
	}

	:global(.mapboxgl-title) {
		margin-top: 1rem;
	}

	:global(.mapboxgl-popup-close-button) {
		color: var(--textBlack);
		padding-bottom: 0.5rem;
	}

	:global(.mapboxgl-pm) {
		font-weight: 600;
	}
</style>
