import { TrpcPlaygroundConfig } from '@trpc-playground/types'
import mergeDeep from 'lodash/merge'
import { zodResolveTypes } from '.'

const defineConfig = <T extends Partial<TrpcPlaygroundConfig>>(config: T): T => config

const defaultConfig = defineConfig({
  resolveTypes: zodResolveTypes,
  polling: {
    enable: true,
    interval: 10000,
  },
  renderOptions: {
    cdnUrl: '//cdn.jsdelivr.net/npm',
  },
})

export const resolveConfig = (config: TrpcPlaygroundConfig) => mergeDeep(defaultConfig, config)
