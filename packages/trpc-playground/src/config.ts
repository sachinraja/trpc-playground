import { TrpcPlaygroundConfig } from '@trpc-playground/types'
import lodash from 'lodash'
import { zodResolveTypes } from '.'
import { version } from './html-version'

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
      superjson: false,
    },
    server: {
      serveHtml: true,
    },
  })

export const resolveConfig = (config: TrpcPlaygroundConfig) => {
  const resolvedConfig = lodash.merge({}, getDefaultConfig(), config)
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
