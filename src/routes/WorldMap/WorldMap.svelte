<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { getAllDevices } from "../../services/device";
  import mapboxgl from "mapbox-gl";

  let airnotes = [];

  let noDataError = false;
  let fetchError = false;
  let loading = true;

  let worldMap;
  let airnoteMarker;
  let zoom = 1;
  let popup;
  let mapboxToken =
    "pk.eyJ1IjoicGFpZ2VuMTEiLCJhIjoiY2lyemJlZ3A0MDBqZTJ5cGs5ZHJicjI2YyJ9.2-dZqM-k2obDN47BpWq5Lw";

  onMount(() => {
    mapboxgl.accessToken = mapboxToken;
    worldMap = new mapboxgl.Map({
      container: "worldMap",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [39.8283, 98.5795],
      zoom,
    });

    getAllDevices()
      .then((data) => {
        airnotes = data.allDevices;
        console.log(airnotes);
        loading = false;
      })
      .catch((err) => {
        console.error(err);
        fetchError = true;
        loading = false;
      });

    // popup = new mapboxgl.Popup().setHTML(
    //   `<p style="text-align: center; margin:0">${format(d, DATE_TIME_KEY)}</p>
    //   <h3 style="margin: 0">Device ID: ${lastReading.device_uid}</h3>`
    // );

    if (airnotes.length) {
      airnotes.forEach((note) => {
        airnoteMarker = new mapboxgl.Marker()
          .setLngLat([note.gps_location.longitude, note.gps_location.latitude])
          .setPopup(popup)
          .addTo(worldMap);
      });
    }
  });
</script>

<svelte:head
  ><title>Airnote World Map</title>
  <link
    href="https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.css"
    rel="stylesheet"
  /></svelte:head
>

<div class="world-map">
  {#if loading}
    <div class="loading" />
  {/if}

  {#if fetchError}
    <div class="alert">
      <h4 class="alert-heading">There was an error fetching the world map.</h4>
      Please try refreshing the page.
    </div>
  {/if}

  {#if airnotes.length > 0}
    <div>Airnote data fetched. Total Airnotes: {airnotes.length}</div>

    {#if worldMap}
      <div in:fade>
        <div class="map-heading">
          <h3 style="margin-top: 1rem">Map</h3>
        </div>
        <div class="map-wrapper">
          <div
            id="worldMap"
            data-cy="worldMap"
            style="height:320px;max-width:960px"
          />
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .world-map {
    min-height: 200px;
    position: relative;
  }
</style>
