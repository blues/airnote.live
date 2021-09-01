<script>
  import { Router, Route } from 'svelte-routing';

  import CloseIcon from './icons/CloseIcon.svelte';
  import MenuIcon from './icons/MenuIcon.svelte';
  import Settings from './routes/Settings/Settings.svelte';
  import Dashboard from './routes/Dashboard/Dashboard.svelte';
  import Home from './routes/Home/Home.svelte';
  import { getCurrentDeviceFromUrl } from './services/device';

  const currentDevice = getCurrentDeviceFromUrl(window.location);

  let menuOpen = false;
  const toggleMenu = () => menuOpen = !menuOpen;

  export let url = '';
  export let pin = currentDevice.pin;
  export let productUID = currentDevice.productUID;
  export let deviceUID = currentDevice.deviceUID;
</script>

<Router {url}>
  <header>
    <a href="https://airnote.live">
      <img alt="Airnote logo" src="/images/airnote.svg" />
    </a>
    {#if deviceUID}
      <ul class="{menuOpen ? 'open' : ''}">
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
          <a href="http://tt.safecast.org/dashboard/note:{deviceUID}" target="_blank">
            Data
          </a>
        </li>
        <li>
          <a href="http://tt.safecast.org/map/note:{deviceUID}" target="_blank">
            Global Map
          </a>
        </li>
      </ul>
      <button class="svg-button" on:click={toggleMenu}>
        {#if menuOpen }<CloseIcon />{/if}
        {#if !menuOpen }<MenuIcon />{/if}
      </button>
    {/if}
  </header>
  <main>
    <div class="container">
      <Route
        path="/:deviceUID"
        component={Settings} {pin} {productUID} />
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
