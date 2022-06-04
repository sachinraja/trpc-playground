import { AnyRouter } from '@trpc/server'
import { DeepRequired } from 'ts-essentials'

export type ClientConfig = {
  /**
   * The endpoint url that the trpc client makes requests to.
   */
  trpcApiEndpoint: string
  /**
   * The endpoint url for the playground, provides data such as the router types.
   */
  playgroundEndpoint: string
  polling?: {
    /**
     * Whether to poll for new types.
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
    globalHeaders?: Record<string, string | undefined>
    /**
     * Batch the playground requests that are sent when the `Run all queries` button is clicked.
     * @default true
     */
    batching?: boolean
    /**
     * Enable the superjson transformer.
     * @default false
     */
    superjson?: boolean
  }
}

export type RenderOptions = {
  /**
   * The version of @trpc-playground/html to use. Specify as `null` to omit `version` from `cdnUrl`.
   * @default latest
   */
  version?: string | null
  /**
   * The cdn to import the @trpc-playground/html scripts from.
   * @default //cdn.jsdelivr.net/npm
   */
  cdnUrl?: string
}

export type Property = {
  name: string
  type: string[]
  array: boolean
  tuple: boolean
  nestedProps: Property[]
  arrayTypes: string[]
  literalValue: any
  enumValues: null | any[]
}

export type InputType = {
  rootTypes: string[]
  properties: Property[]
  array: boolean
  tuple: boolean
  arrayTypes: string[]
  literalValue: any
  enumValues: null | any[]
} | null

export type ResolveTypesReturn = {
  raw: string[]
  queries: { [key: string]: InputType }
  mutations: { [key: string]: InputType }
}

export type ServerConfig = {
  /**
   * The trpc router that the playground server handler uses to generate types.
   */
  router: AnyRouter
  /**
   * Resolves the typescript types for the router and returns an array of types to inject. Uses [`zod-to-ts`](https://github.com/sachinraja/zod-to-ts) by default.
   */
  resolveTypes?: (router: AnyRouter) => ResolveTypesReturn | Promise<ResolveTypesReturn>
  /**
   * Options for rendering the HTML playground page.
   */
  renderOptions?: RenderOptions
  server?: {
    /**
     * The maximum body length to accept in playground requests.
     */
    maxBodySize?: number
    /**
     * Whether to serve the HTML playground page.
     * @default true
     */
    serveHtml?: boolean
  }
}

export type TrpcPlaygroundConfig = ClientConfig & ServerConfig

export type PlaygroundRequestOperation = 'getTypes'

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T

export type DeepRequiredClientConfig = DeepRequired<ClientConfig>
