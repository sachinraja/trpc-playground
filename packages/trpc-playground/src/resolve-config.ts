import { TrpcPlaygroundConfig } from '@trpc-playground/types'
import { zodResolveTypes } from '.'

const defineConfig = <T extends Partial<TrpcPlaygroundConfig>>(config: T): T => config

const defaultConfig = defineConfig({
  refreshTypesTimeout: 10000,
  resolveTypes: zodResolveTypes,
})

export const resolveConfig = (config: TrpcPlaygroundConfig): Required<TrpcPlaygroundConfig> => ({
  ...defaultConfig,
  ...config,
})
