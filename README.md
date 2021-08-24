# airnote.live

This repo contains the source for [airnote.live](https://airnote.live), an
open-source reference implementation of a web-based
[Notecard](https://blues.io/) configuration site.

## Local Development

First install the [node.js runtime](https://nodejs.org/en/)

```sh
npm install # get dependencies
npm run dev # start a dev server
```

The entry-point is [./src/App.svelte](./src/App.svelte).

airnote.live uses the [Svelte](https://svelte.dev/) web framework.

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
