import { TrpcPlaygroundConfig } from '@trpc-playground/types'
import { Handler } from 'express'
import { getCommonHandlerReqData } from './common'
import { nodeHttpHandler } from './node-http'

export const expressHandler = (config: TrpcPlaygroundConfig): Handler => {
  const common = getCommonHandlerReqData(config)

  return async (req, res) => {
    await nodeHttpHandler({ req, res, common })
  }
}
