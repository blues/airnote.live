# airnote.live

This repo contains the source for [airnote.live](https://airnote.live), an
open-source reference implementation of a web-based
[Notecard](https://blues.io/) configuration site.

## Local Development

First install the [Node.js runtime](https://nodejs.org/en/).

```sh
npm install # get dependencies
npm run dev # start a dev server
```

airnote.live uses the [Svelte](https://svelte.dev/) web framework. The entry-point is [./src/App.svelte](./src/App.svelte).

## Server

This app includes a Node.js server for fetching data. You can run that server by running `node server/server.js` in a new command prompt or terminal.

```sh
cd server
node server.js
```

To make development easier, you may want to additionally install [nodemon](https://www.npmjs.com/package/nodemon), and use it to run the server so you automatically see updates after you save changes.

```sh
nodemon server.js
```

The server also depends on a [Notehub API](https://dev.blues.io/reference/notehub-api/api-introduction/) authentication token, `HUB_AUTH_TOKEN`, as an environment variable. You can set this up locally by creating a `server/.env` file, and pasting in the contents below.

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
