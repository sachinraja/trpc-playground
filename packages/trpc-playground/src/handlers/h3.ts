import { TrpcPlaygroundConfig } from '@trpc-playground/types'
import { EventHandler } from 'h3'
import { getH3Adapter } from 'uttp/adapters/h3'
import { handler } from '../handler'

export const h3Handler: (config: TrpcPlaygroundConfig) => Promise<EventHandler> = getH3Adapter(handler)
