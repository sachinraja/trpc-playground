import { cdnHtml } from '@trpc-playground/html'
import { ClientConfig, TrpcPlaygroundConfig } from '@trpc-playground/types'

export const renderPlaygroundPage = (config: TrpcPlaygroundConfig | ClientConfig) => {
  // only send necessary config to client
  // this must be updated with the latest properties whenever ClientConfig is updated
  const clientConfig: ClientConfig = {
    endpoint: config.endpoint,
    refreshTypesTimeout: config.refreshTypesTimeout,
  }

  return cdnHtml.replace('%config%', JSON.stringify(clientConfig))
}
