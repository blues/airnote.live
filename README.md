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

ou can set this up locally by creating a `.env` file, and pasting in the contents below.

```plaintext
HUB_AUTH_TOKEN=<your token>
```

You can refer to [the Notehub API’s authentication documentation](https://dev.blues.io/reference/notehub-api/api-introduction/#authentication) for steps on how to generate your own token.

## Testing

This repo has a unit testing setup based on [Vitest](https://vitest.dev/) and
[Testing Library](https://testing-library.com/docs/svelte-testing-library/intro/). You can run the test suite with the following command.

```sh
npm run test
```

## Production Deployment

Fork this repo and click the button below to deploy.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

See [render.yaml](render.yaml) for details
