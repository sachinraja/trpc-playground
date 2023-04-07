import { appRouter } from '@router'
import { sequence } from '@sveltejs/kit/hooks'
import { svelteKitHandler } from 'trpc-playground/handlers/sveltekit'
import { createTRPCHandle } from 'trpc-sveltekit'

const trpcApiEndpoint = '/api/trpc'
const playgroundEndpoint = '/api/playground'

const trpcHandle = createTRPCHandle({ router: appRouter, url: trpcApiEndpoint })

const playgroundHandle = await svelteKitHandler({
  router: appRouter,
  trpcApiEndpoint,
  playgroundEndpoint,
  polling: {
    interval: 4000,
  },
  // this option is for development, it should be removed on users' configs
  renderOptions: {
    cdnUrl: 'http://localhost:45245',
    version: null,
  },
  request: {
    superjson: true,
  },
})

export const handle = sequence(trpcHandle, playgroundHandle)
