import { ClientConfig, PlaygroundRequestOperation, TrpcPlaygroundConfig } from '@trpc-playground/types'
import { renderPlaygroundPage } from '../render'
import { resolveConfig } from '../resolve-config'

type TrpcPlaygroundRequestHandlerArgs = {
  method: string
  bodyObject: {
    operation: PlaygroundRequestOperation
  }
  common: ReturnType<typeof getCommonHandlerReqData>
}

export const getCommonHandlerReqData = (config: TrpcPlaygroundConfig) => {
  const resolvedConfig = resolveConfig(config)

  const clientConfig: ClientConfig = {
    trpcApiEndpoint: resolvedConfig.trpcApiEndpoint,
    playgroundEndpoint: resolvedConfig.playgroundEndpoint,
    refreshTypesTimeout: resolvedConfig.refreshTypesTimeout,
  }

  const htmlPlaygroundPage = renderPlaygroundPage(resolvedConfig)

  return {
    config: resolvedConfig,
    clientConfig,
    htmlPlaygroundPage,
  }
}

export const handleRequest = async ({ method, bodyObject, common }: TrpcPlaygroundRequestHandlerArgs) => {
  const { config, htmlPlaygroundPage } = common

  switch (method) {
    case 'GET': {
      return {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
        body: htmlPlaygroundPage,
      }
    }

    case 'POST': {
      const operation = bodyObject.operation

      if (operation === 'getTypes') {
        const types = await config.resolveTypes(config.router)

        return {
          headers: {
            'Content-Type': 'application/json',
          },
          json: types,
        }
      } else {
        // not a valid operation, 400 Bad Request
        return { status: 400 }
      }
    }
  }

  return { status: 400 }
}
