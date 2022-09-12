import { getExpressAdapter } from 'uttp/adapters/express'
import { handler } from '../handler'

export const expressHandler = getExpressAdapter(handler)
