import { getNodeAdapter } from 'uttp/adapters/node'
import { handler } from '../handler'

export const nodeHandler = getNodeAdapter(handler)
