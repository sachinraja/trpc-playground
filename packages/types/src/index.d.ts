import { AnyRouter } from '@trpc/server'

export type ClientConfig = {
  /**
   * the endpoint url that the trpc client makes requests to
   */
  trpcApiEndpoint: string
  /**
   * the endpoint url for the playground, provides data such as the router types
   */
  playgroundEndpoint: string
  /**
   * How often the playground client polls the server for new types in milliseconds.
   * If this is `null`, the client will not poll for new types, which is useful in production
   * when types will not change.
   * @default 10000
   */
  refreshTypesTimeout?: number | null
}

export type ServerConfig = {
  /**
   * the trpc router that the playground server handler uses to generate types
   */
  router: AnyRouter
  /**
   * Resolves the typescript types for the router and returns an array of types to inject. Uses [`zod-to-ts`](https://github.com/sachinraja/zod-to-ts) by default.
   */
  resolveTypes?: (router: AnyRouter) => string[] | Promise<string[]>
}

export type TrpcPlaygroundConfig = ClientConfig & ServerConfig

export type PlaygroundRequestOperation = 'getTypes'
