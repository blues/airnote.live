<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import ExternalLinkIcon from "../../icons/ExternalLinkIcon.svelte";
  import mapboxgl from "mapbox-gl";

  export let lastReading;

  let map;
  let airnoteMarker;
  let markerColor;
  let zoom = 10;
  let popup;
  let mapboxToken =
    "pk.eyJ1IjoicGFpZ2VuMTEiLCJhIjoiY2lyemJlZ3A0MDBqZTJ5cGs5ZHJicjI2YyJ9.2-dZqM-k2obDN47BpWq5Lw";

  const layers = ["< 12", "12-35", "35-55", "55-150", "150-250", "250+"];
  const colors = [
    "#6390D4",
    "#ADCDFF",
    "#D9B4EB",
    "#F5818D",
    "#FEF287",
    "#FFFFFF",
  ];

  const determineMarkerColor = (pm2Reading) => {
    if (pm2Reading < 12) {
      markerColor = "#6390D4";
    } else if (pm2Reading > 12 && pm2Reading < 36) {
      markerColor = "#ADCDFF";
    } else if (pm2Reading > 36 && pm2Reading < 56) {
      markerColor = "#D9B4EB";
    } else if (pm2Reading > 56 && pm2Reading < 150) {
      markerColor = "#F5818D";
    } else if (pm2Reading > 150 && pm2Reading < 250) {
      markerColor = "#FEF287";
    } else {
      markerColor = "#f2f1f1";
    }
  };

  onMount(() => {
    mapboxgl.accessToken = mapboxToken;
    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lastReading.lon, lastReading.lat],
      zoom,
    });

    layers.forEach((layer, i) => {
      const color = colors[i];
      const item = document.createElement("div");
      const key = document.createElement("span");
      item.className = "legend-wrapper";
      item.style.display = "flex";
      item.style.alignItems = "center";
      key.className = "legend-key";
      key.style.background = color;
      key.style.height = "15px";
      key.style.width = "15px";
      key.style.marginRight = "8px";

      const value = document.createElement("span");
      value.innerHTML = `${layer}`;
      item.appendChild(key);
      item.appendChild(value);
      legend.appendChild(item);
    });

    popup = new mapboxgl.Popup().setHTML(
      `<h3>Device ID: ${lastReading.device_uid}</h3>
      <p><span class="mapboxgl-pm">PM2.5:</span> ${parseFloat(
        lastReading.pm02_5
      ).toFixed(2)}</p>`
    );

    determineMarkerColor(lastReading.pm02_5);

    airnoteMarker = new mapboxgl.Marker({ color: markerColor })
      .setLngLat([lastReading.lon, lastReading.lat])
      .setPopup(popup)
      .addTo(map);
  });
</script>

<svelte:head>
  <link
    href="https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.css"
    rel="stylesheet"
  />
</svelte:head>

{#if lastReading.lon && lastReading.lat}
  <div in:fade>
    <div class="map-heading">
      <h3>Map</h3>
      <a
        href="https://grafana.safecast.cc/d/t_Z6DlbGz/safecast-all-airnotes"
        class="svg-link"
        target="_blank"
      >
        View all Airnotes on the Safecast global map
        <ExternalLinkIcon />
      </a>
    </div>
    <div class="map-wrapper">
      <div id="map" style="height:300px;max-width:960px" />
      <div id="legend" class="map-overlay" />
    </div>
  </div>
{/if}

<style>
  .map-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  a {
    font-size: 0.8rem;
    font-weight: normal;
    display: flex;
  }

  .map-wrapper {
    display: grid;
  }

  #map {
    grid-area: 1 / 1;
  }

  .map-overlay {
    background: #fff;
    z-index: 2;
    border-radius: 3px;
    grid-area: 1 / 1;
    width: 100px;
    height: 170px;
    margin: auto 0 15px 15px;
    padding: 10px 0 0 10px;
  }

  :global(.mapboxgl-popup-close-button) {
    color: black;
  }

  :global(.mapboxgl-pm) {
    font-weight: 600;
  }
</style>
