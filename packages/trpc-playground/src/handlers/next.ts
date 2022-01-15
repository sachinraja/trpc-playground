import { TrpcPlaygroundConfig } from '@trpc-playground/types'
import { NextApiHandler } from 'next'
import { getCommonHandlerReqData, handleRequest } from './common'

export const nextHandler = (config: TrpcPlaygroundConfig): NextApiHandler => {
  const common = getCommonHandlerReqData(config)

  return async (req, res) => {
    if (!req.method) return res.status(400).end()
    const bodyObject = req.body ?? {}

    const response = await handleRequest({ method: req.method, bodyObject, common })

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
      res.json(response.json)
    }

    res.end()
  }
}
