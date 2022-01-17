import { TrpcPlaygroundConfig } from '@trpc-playground/types'
import { NextApiHandler } from 'next'
import { getCommonHandlerReqData } from './common'
import { nodeHttpHandler } from './node-http'

export const nextHandler = async (config: TrpcPlaygroundConfig): Promise<NextApiHandler> => {
  const common = await getCommonHandlerReqData(config)
  return async (req, res) => {
    await nodeHttpHandler({ req, res, common })
  }
}
