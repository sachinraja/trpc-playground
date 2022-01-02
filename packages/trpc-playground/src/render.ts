import { cdnHtml } from '@trpc-playground/html'
import { TrpcPlaygroundConfig } from '@trpc-playground/types'

export const renderPlaygroundPage = (config: TrpcPlaygroundConfig) => {
  const htmlConfig: Partial<TrpcPlaygroundConfig> = {
    endpoint: config.endpoint,
  }

  return cdnHtml.replace('%config%', JSON.stringify(htmlConfig))
}
