# airnote.live

This repo contains the source for [airnote.live](https://airnote.live), an
open-source reference implementation of a web-based
[Notecard](https://blues.io/) configuration site.

## Local Development

The airnote.live site runs on top of Node.js, so as such you’ll need to start by [installing Node.js](https://nodejs.org/en/download/) if you haven’t already.

Next, run the site’s `npm run setup` script, which installs all of the site’s dependencies.

```
npm run setup
```

Finally, run `npm run dev`, which starts up a development server.

```sh
npm run dev
```

## Web App

You can access the airnote.live locally at `http://localhost:5555/`. To view a specific device’s dashboard, you’ll need to use a URL of `http://localhost:5555/dashboard/<device_uid>`.

The airnote.live site uses the [Svelte](https://svelte.dev/) web framework, and the entry-point is [./src/App.svelte](./src/App.svelte).

## Server

This repo includes a Node.js server for fetching data. The repo’s main `npm run dev` script starts the server, and automatically updates the server whenever you make changes.

The server depends on a [Notehub API](https://dev.blues.io/reference/notehub-api/api-introduction/) authentication token, `HUB_AUTH_TOKEN`, as an environment variable. You can set this up locally by creating a `server/.env` file, and pasting in the contents below.

```
HUB_AUTH_TOKEN=<your token>
```

You can refer to [the Notehub API’s authentication documentation](https://dev.blues.io/reference/notehub-api/api-introduction/#authentication) for steps on how to generate your own token.

## Testing

This repo has a unit testing setup based on [Jest](https://jestjs.io/) and 
[Testing Library](https://testing-library.com/docs/svelte-testing-library/intro/). You can run the test suite with the following command.

``` sh
npm run test
```

## Production Deployment

Fork this repo and click the button below to deploy.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

See [render.yaml](render.yaml) for details
