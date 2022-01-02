import { appRouter } from '@server/router'
import { nextHandler } from '../../../trpc-playground/src/handlers/next'

export default nextHandler({
  router: appRouter,
})
