import * as trpcExpress from '@trpc/server/adapters/express'
import cors from 'cors'
import express from 'express'
import { expressHandler } from '../../../packages/trpc-playground/src/handlers/express'
import { appRouter } from '../../router'

const app = express()
app.use(cors())

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
  expressHandler({
    trpcApiEndpoint,
    playgroundEndpoint,
    router: appRouter,
    renderOptions: {
      cdnUrl: 'http://localhost:45245',
    },
  }),
)

app.listen(3000, () => {
  console.log('express server listening at http://localhost:3000')
})
