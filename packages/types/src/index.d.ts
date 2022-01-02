import { AnyRouter } from '@trpc/server'

export type TrpcPlaygroundConfig = {
  endpoint: string
  router: AnyRouter
}

export type HtmlValidTrpcPlaygroundConfig = Pick<TrpcPlaygroundConfig, 'endpoint'>
