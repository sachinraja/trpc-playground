import * as trpcExpress from '@trpc/server/adapters/express'
import express from 'express'
import { expressHandler } from 'trpc-playground/handlers/express'
import { appRouter } from '../router'

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
      // this option is for development, it should be removed on users' configs
      renderOptions: {
        cdnUrl: 'http://localhost:45245',
        version: null,
      },
    }),
  )

  app.listen(3000, () => {
    console.log('listening at http://localhost:3000')
  })
}

runApp()
