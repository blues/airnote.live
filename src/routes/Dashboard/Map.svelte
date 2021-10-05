<script>
  import ExternalLinkIcon from '../../icons/ExternalLinkIcon.svelte';

  export let lastReading;
  export let deviceUID;

  let zoomLevel = 10;
  let imageDimensions = '960x300';
  let mapboxToken = 'pk.eyJ1IjoidGp2YW50b2xsYmx1ZXMiLCJhIjoiY2t1ZThuNzBiMHk5dzJvbzk2Ym5uMG03ZiJ9.Twd-L6c9Y3ewBv0UKYKTCQ';
  let mapUrl = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+555555(' +
    `${lastReading.loc_lon},${lastReading.loc_lat}` +
    ')/' +
    `${lastReading.loc_lon},${lastReading.loc_lat}` +
    `,${zoomLevel},0/${imageDimensions}?access_token=` +
    mapboxToken;
</script>

<div>
  <h3>Map</h3>
  <a href="http://tt.safecast.org/map/note:{deviceUID}" class="svg-link" target="_blank">
    View all Airnotes on the Safecast global map
    <ExternalLinkIcon />
  </a>
</div>

<img alt="Your Airnote’s location" src={mapUrl} />

<style>
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  a {
    font-size: 0.8rem;
    font-weight: normal;
    display: flex;
  }
  img {
    max-width: 100%;
    object-fit: none;
  }
</style>