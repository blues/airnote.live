<script>
  import { Router, Route, navigate } from "svelte-routing";
  import { onMount } from "svelte";

  import CloseIcon from "./icons/CloseIcon.svelte";
  import MenuIcon from "./icons/MenuIcon.svelte";
  import Settings from "./routes/Settings/Settings.svelte";
  import Dashboard from "./routes/Dashboard/Dashboard.svelte";
  import Home from "./routes/Home/Home.svelte";
  import { getCurrentDeviceFromUrl } from "./services/device";

  const location = window.location;
  const currentDevice = getCurrentDeviceFromUrl(location);

  let menuOpen = false;
  const toggleMenu = () => (menuOpen = !menuOpen);

  export let url = "";
  export let pin = currentDevice.pin;
  export let productUID = currentDevice.productUID;
  export let deviceUID = currentDevice.deviceUID;
  export let internalNav = currentDevice.internalNav;

  onMount(() => {
    /* Notehub links to a device’s dashboard using `/${deviceUID}` with no pin,
    and we want Notehub users to view the device’s dashboard, and not the
    settings page. */
    if (
      deviceUID &&
      location.pathname === "/" + deviceUID &&
      !pin &&
      !internalNav
    ) {
      navigate(`/${deviceUID}/dashboard`, { replace: true });
    }
  });
</script>

<Router {url}>
  <header>
    <a href="/">
      <img alt="Airnote logo" src="/images/airnote.svg" />
    </a>
    {#if deviceUID}
      <ul class={menuOpen ? "open" : ""}>
        <li>
          <a
            href="/{deviceUID}?product={productUID}&pin={pin}&internalNav=true"
            data-cy="settings-link"
          >
            Settings
          </a>
        </li>
        <li>
          <a href="/{deviceUID}/dashboard" data-cy="dashboard-link">
            Dashboard
          </a>
        </li>
      </ul>
      <button class="svg-button" on:click={toggleMenu}>
        {#if menuOpen}<CloseIcon />{/if}
        {#if !menuOpen}<MenuIcon />{/if}
      </button>
    {/if}
  </header>
  <main>
    <div class="container">
      <Route path="/:deviceUID" component={Settings} {pin} {productUID} />
      <Route path="/:deviceUID/dashboard" component={Dashboard} />
      <Route path="/" component={Home} />

      <hr />

      <footer>
        <div>
          Cloud-connected by <br />
          <a
            target="_blank"
            href="https://blues.io/products"
            data-cy="notecard-link">Notecard</a
          >
        </div>
        <div>
          Developed by <br />
          <a target="_blank" href="https://blues.io" data-cy="blues-link"
            >Blues Inc.</a
          >
        </div>
        <div>
          In Partnership with <br />
          <a target="_blank" href="https://safecast.org" data-cy="safecast-link"
            >Safecast</a
          >
        </div>
      </footer>
    </div>
  </main>
</Router>

<style>
</style>
