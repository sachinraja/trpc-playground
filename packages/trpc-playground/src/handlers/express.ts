import { TrpcPlaygroundConfig } from '@trpc-playground/types'
import { Handler } from 'express'
import { getCommonHandlerReqData, handleRequest } from './common'

export const expressHandler = (config: TrpcPlaygroundConfig): Handler => {
  const common = getCommonHandlerReqData(config)

  return async (req, res) => {
    const response = await handleRequest({ method: req.method, bodyObject: req.body, common })
    if (response.headers) {
      for (const [key, value] of Object.entries(response.headers)) {
        res.setHeader(key, value)
      }
    }

    if (response.status) {
      res.status(response.status)
    }

    if (response.body) {
      res.write(response.body)
    } else if (response.json) {
      return res.json(response.json)
    }

    res.end()
  }
}
