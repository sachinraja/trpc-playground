import { ClientConfig } from '@trpc-playground/types'

const defineClientConfig = <T extends Partial<ClientConfig>>(config: T): T => config

const defaultConfig = defineClientConfig({
  refreshTypesTimeout: 10000,
})

export const resolveConfig = (config: ClientConfig): Required<ClientConfig> => ({ ...defaultConfig, ...config })
