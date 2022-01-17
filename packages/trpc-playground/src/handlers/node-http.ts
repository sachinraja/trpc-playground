import http from 'http'
import { CommonHandlerReqData, handleRequest } from './common'
import { HTTPRequest, NodeHTTPRequest } from './utils/types'

type NodeHttpHandlerArgs = {
  req: NodeHTTPRequest
  res: http.ServerResponse
  common: CommonHandlerReqData
}

export const nodeHttpHandler = async ({ req, res, common }: NodeHttpHandlerArgs) => {
  const innerReq: HTTPRequest = {
    method: req.method!,
    headers: req.headers,
    body: req.body,
  }

  const response = await handleRequest({ rawReq: req, req: innerReq, common })

  if (response.status) {
    res.statusCode = response.status
  }

  if (response.headers) {
    for (const [key, value] of Object.entries(response.headers)) {
      res.setHeader(key, value)
    }
  }

  if (response.body) {
    res.end(response.body)
  }
}
