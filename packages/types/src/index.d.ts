import { AnyRouter } from '@trpc/server'

export type ClientConfig = {
  /**
   * the endpoint url that the trpc client makes requests to
   */
  endpoint: string
  /**
   * How often the playground client polls the server for new types in milliseconds.
   * If this is `null`, the client will not poll for new types.
   * @default 10000
   */
  refreshTypesTimeout?: number | null
}

export type ServerConfig = {
  /**
   * the trpc router that the playground server handler uses to generate types
   */
  router: AnyRouter
}

export type TrpcPlaygroundConfig = ClientConfig & ServerConfig

export type PlaygroundRequestOperation = 'getTypes'
