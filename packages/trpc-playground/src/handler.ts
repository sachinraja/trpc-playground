import { renderPlaygroundPage } from '@trpc-playground/html'
import { PlaygroundRequestOperation, TrpcPlaygroundConfig } from '@trpc-playground/types'
import { defineHandler, RawRequest } from 'uttp'
import { resolveConfig } from './config'

export type HTTPBody = {
  operation: PlaygroundRequestOperation
}

export const handler = defineHandler(async (helpers, config: TrpcPlaygroundConfig) => {
  const resolvedConfig = resolveConfig(config)

  let htmlPlaygroundPage: string | undefined = undefined

  if (resolvedConfig.server?.serveHtml) {
    htmlPlaygroundPage = renderPlaygroundPage({
      ...resolvedConfig.renderOptions,
      clientConfig: resolvedConfig,
    })
  }

  const types = await resolvedConfig.resolveTypes(config.router)
  const stringifiedTypes = JSON.stringify(types)

  return {
    async handleRequest(request) {
      if (request.method === 'HEAD') {
        // can be used for lambda warmup
        return {
          status: 204,
          body: undefined,
        }
      }

      if (request.method === 'GET' && resolvedConfig.server.serveHtml) {
        return {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
          },
          body: htmlPlaygroundPage,
        }
      }

      if (request.method === 'POST') {
        let body: string | undefined = (request.rawRequest as RawRequest & { body: string | undefined }).body

        if (!body) {
          try {
            body = await helpers.parseBodyAsString(request.rawRequest)
            console.log('body')
          } catch {
            return { status: 413, body: undefined }
          }
        }

        const bodyObject: HTTPBody = typeof body === 'string' ? JSON.parse(body) : body

        if (bodyObject.operation === 'getRouterSchema') {
          return {
            headers: {
              'Content-Type': 'application/json',
            },
            status: 200,
            body: stringifiedTypes,
          }
        }

        // not a valid operation, 400 Bad Request
        return { status: 400, body: undefined }
      }

      return { status: 400, body: undefined }
    },
    adapterOptions: { maxBodySize: resolvedConfig.server.maxBodySize },
  }
})
