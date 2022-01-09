import { appRouter } from '@router'
import { nextHandler } from 'trpc-playground/handlers/next'

export default nextHandler({
  router: appRouter,
  trpcApiEndpoint: '/api/trpc',
  playgroundEndpoint: '/api/trpc-playground',
  refreshTypesTimeout: 1000,
})
