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

  polling?: {
    /**
     * whether to poll for new types or not
     * @default true
     */
    enable?: boolean

    /**
     * How often the playground client polls the server for new types in milliseconds.
     * If this is `null`, the client will not poll for new types, which is useful in production
     * when types will not change.
     * @default 10000
     */
    interval?: number
  }

  request?: {
    /**
     * Headers sent on every tRPC Playground request.
     */
    globalHeaders?: Record<string, string>
  }
}

export type RenderOptions = {
  /**
   * The version of @trpc-playground/html to use.
   * @default latest
   */
  version?: number
  /**
   * The cdn to import the @trpc-playground/html scripts from.
   * @default //cdn.jsdelivr.net/npm
   */
  cdnUrl?: string
}

export type ServerConfig = {
  /**
   * The trpc router that the playground server handler uses to generate types.
   */
  router: AnyRouter
  /**
   * Resolves the typescript types for the router and returns an array of types to inject. Uses [`zod-to-ts`](https://github.com/sachinraja/zod-to-ts) by default.
   */
  resolveTypes?: (router: AnyRouter) => string[] | Promise<string[]>

  /**
   * Options for rendering the HTML playground page.
   */
  renderOptions?: RenderOptions
}

export type TrpcPlaygroundConfig = ClientConfig & ServerConfig

export type PlaygroundRequestOperation = 'getTypes'

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T
