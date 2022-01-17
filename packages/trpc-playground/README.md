# tRPC Playground

playground for running tRPC queries in the browser

https://user-images.githubusercontent.com/58836760/149615216-a2b2725d-abcc-4c59-9c51-e5b9718bf269.mp4

## Installation

```sh
npm install trpc-playground
```

## Handlers

tRPC Playground provides handlers that serve the playground HTML page and handle playground-related requests such as getting types from the router.

<details>
<summary>Next.js</summary>

[Example](https://github.com/sachinraja/trpc-playground/tree/main/apps/next)

```ts
// pages/api/trpc-playground.ts
import { NextApiHandler } from 'next'
import { appRouter } from 'server/routers/_app'
import { nextHandler } from 'trpc-playground/handlers/next'

const setupHandler = nextHandler({
  router: appRouter,
  // tRPC api path, pages/api/trpc/[trpc].ts in this case
  trpcApiEndpoint: '/api/trpc',
  playgroundEndpoint: '/api/trpc-playground',
})

const handler: NextApiHandler = async (req, res) => {
  const playgroundHandler = await setupHandler
  await playgroundHandler(req, res)
}

export default handler
```

</details>

<details>
<summary>Express</summary>

[Example](https://github.com/sachinraja/trpc-playground/tree/main/apps/express)

```ts
// server.ts
import * as trpcExpress from '@trpc/server/adapters/express'
import express from 'express'
import { expressHandler } from 'trpc-playground/handlers/express'
import { appRouter } from './router'

const runApp = async () => {
  const app = express()

  const trpcApiEndpoint = '/api/trpc'
  const playgroundEndpoint = '/api/trpc-playground'

  app.use(
    trpcApiEndpoint,
    trpcExpress.createExpressMiddleware({
      router: appRouter,
    }),
  )

  app.use(
    playgroundEndpoint,
    await expressHandler({
      trpcApiEndpoint,
      playgroundEndpoint,
      router: appRouter,
    }),
  )

  app.listen(3000, () => {
    console.log('listening at http://localhost:3000')
  })
}

runApp()
```

</details>

## Settings

For all configuration options, see [the API docs](https://paka.dev/npm/@trpc-playground/types#module-index-export-TrpcPlaygroundConfig).
