import * as trpcExpress from '@trpc/server/adapters/express'
import cors from 'cors'
import express from 'express'
import { expressHandler } from '../../../packages/trpc-playground/src/handlers/express'
import { appRouter } from '../../router'

const runApp = async () => {
  const app = express()
  // Vite client makes requests from different port
  app.use(cors())

  const trpcApiEndpoint = '/api/trpc'
  const playgroundEndpoint = '/api/trpc-playground'

  const trpcMiddleware = trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
  app.use(
    trpcApiEndpoint,
    (req, res, next) => {
      trpcMiddleware(req, res, next)
    },
  )

  app.use(
    playgroundEndpoint,
    await expressHandler({
      trpcApiEndpoint,
      playgroundEndpoint,
      router: appRouter,
      renderOptions: {
        cdnUrl: 'http://localhost:45245',
        version: null,
      },
    }),
  )

  app.listen(3000, () => {
    console.log('express server listening at http://localhost:3000')
  })
}

runApp()
