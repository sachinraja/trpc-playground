import { renderPlaygroundPage } from '@trpc-playground/html'
import { Awaited, TrpcPlaygroundConfig } from '@trpc-playground/types'
import { resolveConfig } from '../config'
import { getPostBody } from './utils/get-post-body'
import { HTTPBody, HTTPRequest, NodeHTTPRequest } from './utils/types'

export type CommonHandlerReqData = Awaited<ReturnType<typeof getCommonHandlerReqData>>

export const getCommonHandlerReqData = async (config: TrpcPlaygroundConfig) => {
  const resolvedConfig = resolveConfig(config)

  let htmlPlaygroundPage: string | undefined = undefined

  if (resolvedConfig.server?.serveHtml) {
    htmlPlaygroundPage = renderPlaygroundPage({
      ...resolvedConfig.renderOptions,
      clientConfig: resolvedConfig,
    })
  }

  const types = await resolvedConfig.resolveTypes!(config.router)
  console.log(types)

  return {
    config: resolvedConfig,
    htmlPlaygroundPage,
    types,
  }
}

type TrpcPlaygroundRequestHandlerArgs = {
  rawReq: NodeHTTPRequest
  req: HTTPRequest
  common: CommonHandlerReqData
}
export const handleRequest = async ({ rawReq, req, common }: TrpcPlaygroundRequestHandlerArgs) => {
  const { types, htmlPlaygroundPage, config } = common

  if (req.method === 'HEAD') {
    // can be used for lambda warmup
    return {
      status: 204,
    }
  }

  if (req.method === 'GET' && common.config.server.serveHtml) {
    return {
      headers: {
        'Content-Type': 'text/html',
      },
      body: htmlPlaygroundPage,
    }
  }

  if (req.method === 'POST') {
    const bodyResult = await getPostBody({ req: rawReq, maxBodySize: config.server.maxBodySize })
    if (bodyResult.ok === false) return { status: 413 }

    const body = bodyResult.data

    const bodyObject: HTTPBody = typeof body === 'string' ? JSON.parse(body) : body

    if (bodyObject.operation === 'getTypes') {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...types, types: types.raw }),
      }
    } else {
      // not a valid operation, 400 Bad Request
      return { status: 400 }
    }
  }

  return { status: 400 }
}
