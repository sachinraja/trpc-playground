import { TrpcPlaygroundConfig } from '@trpc-playground/types'
import mergeDeep from 'lodash/merge'
import { version } from '../../html/package.json'
import { zodResolveTypes } from '.'

const defineConfig = <T extends Partial<TrpcPlaygroundConfig>>(config: T): T => config

const getDefaultConfig = () =>
  defineConfig({
    resolveTypes: zodResolveTypes,
    polling: {
      enable: true,
      interval: 4000,
    },
    renderOptions: {
      cdnUrl: '//cdn.jsdelivr.net/npm',
      version,
    },
    request: {
      globalHeaders: {},
      batching: true,
    },
    server: {},
  })

export const resolveConfig = (config: TrpcPlaygroundConfig) => {
  const resolvedConfig = mergeDeep({}, getDefaultConfig(), config)
  // fix for version being null
  const resolvedVersion = config?.renderOptions?.version === null
    ? null
    : resolvedConfig.renderOptions.version

  return {
    ...resolvedConfig,
    renderOptions: {
      ...resolvedConfig.renderOptions,
      version: resolvedVersion,
    },
  }
}
