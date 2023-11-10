# airnote.live

This repo contains the source for [airnote.live](https://airnote.live), an
open-source reference implementation of a web-based
[Notecard](https://blues.io/) configuration site.

## Local Development

The airnote.live site runs on top of Node.js, so as such you’ll need to start by [installing Node.js](https://nodejs.org/en/download/) if you haven’t already.

It also uses npm as its package manager, so [add npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) as well if it's not already installed locally.

Next, run command `npm install`, which installs all of the site’s dependencies.

```sh
npm install
```

Then, run `npm run dev`, which starts up a development server.

```sh
npm run dev
```

## Web App

You can access the airnote.live site locally at `http://localhost:5173/`. To view a specific device’s dashboard, you’ll need to use a URL of `http://localhost:5173/<device_uid>/dashboard`.

The airnote.live site uses the [Svelte](https://svelte.dev/) library in conjunction with the production ready [SvelteKit](https://kit.svelte.dev/) web framework, and the entry-point is [./src/routes/+page.svelte](./src/routes/+page.svelte).

It fetches all of its data from the Notehub Airnote project via the Blues [Notehub JS library](https://www.npmjs.com/package/@blues-inc/notehub-js). The Notehub JS repo requires an authentication token to interact with the Notehub API.

You can set this up locally by creating a `.env` file, and pasting in the contents below.

```plaintext
HUB_AUTH_TOKEN=<your token>
```

You can refer to [the Notehub API’s authentication documentation](https://dev.blues.io/reference/notehub-api/api-introduction/#authentication) for steps on how to generate your own token.

It also uses a Mapbox API token to display the device's location on a map on the dashboard page. This token can also be added to the `.env` file, under the name listed below.

You can create your own Mapbox API token by [signing up for a free Mapbox account](https://account.mapbox.com/auth/signin/?route-to=%22https%3A%2F%2Faccount.mapbox.com%2F%22) and following these [instructions to create an access token](https://docs.mapbox.com/help/glossary/access-token/).

```plaintext
PUBLIC_MAPBOX_TOKEN=<your mapbox token>
```

## Testing

### Unit Testing

This repo has a unit testing setup based on [Vitest](https://vitest.dev/) and
[Testing Library](https://testing-library.com/docs/svelte-testing-library/intro/). You can run the test suite with the following command.

```sh
npm run test
```

### E2E Testing

It also has end-to-end testing using [Cypress](https://www.cypress.io), which is designed to mimic how an actual user would interact with the site.

All E2E testing is located in the [cypress/](./cypress/) folder. Cypress can be run either in with or without a visible browser ("headless mode"). The visible browser is good for debugging failing tests, and headless is good for running in CI pipelines like GitHub Action workflows.

To run Cypress tests, first start the local development server in one terminal window with:

```sh
npm run dev
```

Then, start the Cypress tests running in another terminal window. For headless Cypress tests, which will only print their output to the console, run the following command.

```sh
npm run cypress:run
```

For a UI where you can interact with tests, choose which files to run, debug, etc., run Cypress in "headed mode" like so:

```sh
npm run cypress:open
```
