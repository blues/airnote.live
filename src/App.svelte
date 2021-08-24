<script>
  import { Router, Route } from "svelte-routing";
  import queryString from "query-string";

  import Configuration from "./routes/Configuration.svelte";
  import Dashboard from "./routes/Dashboard.svelte";
  import Home from "./routes/Home.svelte";
  import { airnoteProductUID } from "./constants";
  import { readLastViewedDevice, saveLastViewedDevice } from './services/device';
  import ExternalLink from './icons/ExternalLink.svelte';

  export let url = '';
  export let pin;
  export let productUID;
  export let deviceUID;

  const lastViewedDevice = readLastViewedDevice();

  if (typeof window != 'undefined') {
    const query = queryString.parse(window.location.search);
    pin = query['pin'] || '';
    productUID = query['product'] || airnoteProductUID;
    deviceUID = window.location.pathname.match(/dev:\d*/)?.[0];

    // If there is no device in the query string default to the
    // last viewed device.
    if (lastViewedDevice.deviceUID && !deviceUID) {
      deviceUID = lastViewedDevice.deviceUID;
    }

    // If still working with the last viewed device, and we don’t have
    // a pin or productUID in the URL, grab those from local storage.
    if (deviceUID === lastViewedDevice.deviceUID) {
      if (!pin) pin = lastViewedDevice.pin;
      if (!productUID) productUID = lastViewedDevice.productUID
    }

    if (deviceUID) {
      saveLastViewedDevice({
        pin: pin,
        productUID: productUID,
        deviceUID: deviceUID,
      });
    }
  }
</script>

<Router {url}>
  <header>
    <a href="https://blues.io/">
      <img alt="Blues Wireless" src="/images/logo-white.svg" />
    </a>
    {#if deviceUID}
      <ul>
        <li>
          <a href="/{deviceUID}?product={productUID}&pin={pin}">
            Settings
          </a>
        </li>
        <li>
          <a href="/{deviceUID}/dashboard">
            Dashboard
          </a>
        </li>
        <li>
          <a href="https://airnote.live/{deviceUID}">
            Raw Data
            <ExternalLink />
          </a>
        </li>
        <li>
          <a href="https://grafana.safecast.cc/d/t_Z6DlbGz/safecast-all-airnotes">
            Global Map
            <ExternalLink />
          </a>
        </li>
      </ul>
    {/if}
  </header>
  <main>
    <div class="container">
      <Route
        path="/:deviceUID"
        component={Configuration} {pin} {productUID} />
      <Route
        path="/:deviceUID/dashboard"
        component={Dashboard} />
      <Route
        path="/"
        component={Home} />

      <hr />

      <footer>
        <div>
          Cloud-connected by <br />
          <a target="_blank" href="https://blues.io/products">Notecard</a>
        </div>
        <div>
          Developed by <br />
          <a target="_blank" href="https://blues.io">Blues Inc.</a>
        </div>
        <div>
          In Partnership with <br />
          <a target="_blank" href="https://safecast.org">Safecast</a>
        </div>
      </footer>
    </div>
  </main>
</Router>

<style>
</style>
