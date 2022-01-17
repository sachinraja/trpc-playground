import { renderPlaygroundPage } from '@trpc-playground/html'
import { TrpcPlaygroundConfig } from '@trpc-playground/types'
import { resolveConfig } from '../config'
import { getPostBody } from './utils/get-post-body'
import { HTTPBody, HTTPRequest, NodeHTTPRequest } from './utils/types'

type TrpcPlaygroundRequestHandlerArgs = {
  rawReq: NodeHTTPRequest
  req: HTTPRequest
  common: ReturnType<typeof getCommonHandlerReqData>
}

export const getCommonHandlerReqData = (config: TrpcPlaygroundConfig) => {
  const resolvedConfig = resolveConfig(config)

  const htmlPlaygroundPage = renderPlaygroundPage({
    ...resolvedConfig.renderOptions,
    clientConfig: resolvedConfig,
  })

  return {
    config: resolvedConfig,
    htmlPlaygroundPage,
  }
}

export const handleRequest = async ({ rawReq, req, common }: TrpcPlaygroundRequestHandlerArgs) => {
  const { config, htmlPlaygroundPage } = common

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
        const types = await config.resolveTypes(config.router)
        const body = JSON.stringify(types)

        return {
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        }
      } else {
        // not a valid operation, 400 Bad Request
        return { status: 400 }
      }
    }
  }

  return { status: 400 }
}
