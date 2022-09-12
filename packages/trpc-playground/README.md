# tRPC Playground

Playground for running tRPC queries in the browser. Backed by CodeMirror and the TypeScript language server to provide you with the same fully-typed experience.

https://user-images.githubusercontent.com/58836760/150659582-ff844a0f-e1b8-4cb4-8d89-0d53a8669db5.mp4

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
  // uncomment this if you're using superjson
  // request: {
  //   superjson: true,
  // },
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
      // uncomment this if you're using superjson
      // request: {
      //   superjson: true,
      // },
    }),
  )

  app.listen(3000, () => {
    console.log('listening at http://localhost:3000')
  })
}

runApp()
```

</details>

tRPC Playground also supports Fastify, Fetch, h3, Koa, and AWS Lambda. You can import them using this format: `trpc-playground/handlers/{framework}`.

## Settings

For all configuration options, see [the API docs](https://paka.dev/npm/@trpc-playground/types@0.1.1/api#be2d1ce7878179d).

## Writing Queries

In the playground, writing queries is meant to mimic the experience of writing queries in a tRPC client as closely as possible. You can even write TS and your code will be transformed to JS before it is run.

For `trpc.query(path, inputArgs)` or `trpc.useQuery([path, inputArgs])`:

```ts
await query(path, inputArgs)

// example
await query('getUser', { id: 4 })
```

For `trpc.mutation(path, inputArgs)` or `trpc.useMutation([path, inputArgs])`:

```ts
await mutation(path, inputArgs)

// example
await mutation('createUser', { name: 'Bob' })
```

When using the `Run all queries` button in the center of the editor, you can write any code and it will just work:

```ts
const name: string = 'John'

await query('getGreeting', { name })
await query('getFarewell', { name })
```

Queries can be run individually by pressing on the button to the left of them or by pressing `Alt + Q` when your cursor in the editor is on the query. Note that any variables you pass to the query will not be defined when running queries individually.

If `request.batching` is `false` in your config (it is `true` by default), the queries will be run one at a time so you can use the return value of one query and pass it to the next:

```ts
const { sum } = await query('addNums', { a: 1, b: 2 })
await query('subtractNums', { a: sum, b: -7 })
```

## Types

tRPC Playground resolves the types for your queries based on the `input` schema in your router. The default resolver is [`zod-to-ts`](https://github.com/sachinraja/zod-to-ts), which should work out of the box for the most part. However, there are [a few special cases that it may not handle correctly](https://github.com/sachinraja/zod-to-ts#special-cases) such as `z.lazy()` and `z.nativeEnum()`, so read those docs for more information on how to handle these cases if you have any issues with them.
