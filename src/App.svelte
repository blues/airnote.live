<script>
  import { Router, Route, navigate } from "svelte-routing";
  import queryString from "query-string";

  import Configuration from "./routes/Configuration.svelte";
  import Dashboard from "./routes/Dashboard.svelte";
  import Home from "./routes/Home.svelte";
  import { airnoteProductUID } from "./constants";

  export let url = "";
  export let pin;
  export let productUID;
  export let deviceUID;

  if (typeof window != "undefined") {
    const query = queryString.parse(window.location.search);
    pin = query["pin"] ? query["pin"] : "";
    productUID = query["product"] ? query["product"] : airnoteProductUID;
    deviceUID = window.location.pathname.replace("/", "");
  }

  if (
    pin === "" &&
    deviceUID !== "" &&
    window.location.pathname.indexOf("dashboard") == -1
  ) {
    // Temporary. Need to figure out the best URL structure at some point.
    // navigate(`dashboard/${deviceUID}`);
    // navigate(`http://tt.safecast.org/dashboard/note:${deviceUID}`, { replace: true });
  }
</script>

<Router {url}>
  <header>
    <a href="https://blues.io/">
      <img alt="Blues Wireless" src="/images/logo-white.svg" />
    </a>
  </header>
  <main>
    <div class="container">
      <Route
        path="/:deviceUID"
        component={Configuration} {pin} {productUID} />
      <Route
        path="/dashboard/:deviceUID"
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
