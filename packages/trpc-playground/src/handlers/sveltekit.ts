import type { Handle } from '@sveltejs/kit'
import { TrpcPlaygroundConfig } from '@trpc-playground/types'
import { fetchHandler } from './fetch'

export const svelteKitHandler = async (config: TrpcPlaygroundConfig): Promise<Handle> => {
  const handler = await fetchHandler(config)

  return async ({ event, resolve }) => {
    if (event.url.pathname.startsWith(config.playgroundEndpoint)) {
      const { body, headers, status, statusText } = await handler(event.request)
      return new Response(body, { status, statusText, headers })
    }

    return resolve(event)
  }
}
