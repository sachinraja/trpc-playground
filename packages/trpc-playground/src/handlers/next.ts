import { TrpcPlaygroundConfig } from '@trpc-playground/types'
import { NextApiHandler } from 'next'
import { nodeHandler } from './node'

export const nextHandler: (config: TrpcPlaygroundConfig) => Promise<NextApiHandler> = nodeHandler
