import { appRouter } from '@router'
import { NextApiHandler } from 'next'
import { nextHandler } from 'trpc-playground/handlers/next'

const setupHandler = nextHandler({
  router: appRouter,
  trpcApiEndpoint: '/api/trpc',
  playgroundEndpoint: '/api/trpc-playground',
  polling: {
    interval: 4000,
  },
  // this option is for development, it should be removed on users' configs
  renderOptions: {
    cdnUrl: 'http://localhost:45245',
  },
})

const handler: NextApiHandler = async (req, res) => {
  const playgroundHandler = await setupHandler
  await playgroundHandler(req, res)
}

export default handler
