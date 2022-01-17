import { TrpcPlaygroundConfig } from '@trpc-playground/types'
import { NextApiHandler } from 'next'
import { getCommonHandlerReqData } from './common'
import { nodeHttpHandler } from './node-http'

export const nextHandler = (config: TrpcPlaygroundConfig): NextApiHandler => {
  const common = getCommonHandlerReqData(config)
  return async (req, res) => {
    await nodeHttpHandler({ req, res, common })
  }
}
