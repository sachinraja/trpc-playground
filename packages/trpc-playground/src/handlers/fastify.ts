import { TrpcPlaygroundConfig } from '@trpc-playground/types'
import { FastifyPluginCallback } from 'fastify'
import { getFastifyAdapter } from 'uttp/adapters/fastify'
import { handler } from '../handler'

export const getFastifyPlugin: (config: TrpcPlaygroundConfig) => Promise<FastifyPluginCallback> = getFastifyAdapter(
  handler,
)
