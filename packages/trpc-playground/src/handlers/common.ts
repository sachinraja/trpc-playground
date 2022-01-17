import { renderPlaygroundPage } from '@trpc-playground/html'
import { Awaited, TrpcPlaygroundConfig } from '@trpc-playground/types'
import { resolveConfig } from '../config'
import { getPostBody } from './utils/get-post-body'
import { HTTPBody, HTTPRequest, NodeHTTPRequest } from './utils/types'

export type CommonHandlerReqData = Awaited<ReturnType<typeof getCommonHandlerReqData>>

export const getCommonHandlerReqData = async (config: TrpcPlaygroundConfig) => {
  const resolvedConfig = resolveConfig(config)

  const htmlPlaygroundPage = renderPlaygroundPage({
    ...resolvedConfig.renderOptions,
    clientConfig: resolvedConfig,
  })

  const types = await resolvedConfig.resolveTypes(config.router)
  return {
    config: resolvedConfig,
    htmlPlaygroundPage,
    stringifiedTypes: JSON.stringify(types),
  }
}

type TrpcPlaygroundRequestHandlerArgs = {
  rawReq: NodeHTTPRequest
  req: HTTPRequest
  common: CommonHandlerReqData
}
export const handleRequest = async ({ rawReq, req, common }: TrpcPlaygroundRequestHandlerArgs) => {
  const { stringifiedTypes, htmlPlaygroundPage } = common

  switch (req.method) {
    // can be used for lambda warmup
    case 'HEAD': {
      return {
        status: 204,
      }
    }

    case 'GET': {
      return {
        headers: {
          'Content-Type': 'text/html',
        },
        body: htmlPlaygroundPage,
      }
    }

    case 'POST': {
      const { data: bodyData } = await getPostBody({ req: rawReq })

      // req.body may already have been parsed by a json handler
      const bodyObject: HTTPBody = typeof bodyData === 'string' ? JSON.parse(bodyData) : req.body

      if (bodyObject.operation === 'getTypes') {
        return {
          headers: {
            'Content-Type': 'application/json',
          },
          body: stringifiedTypes,
        }
      } else {
        // not a valid operation, 400 Bad Request
        return { status: 400 }
      }
    }
  }

  return { status: 400 }
}
