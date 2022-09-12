import { getFetchAdapter } from 'uttp/adapters/fetch'
import { handler } from '../handler'

export const fetchHandler = getFetchAdapter(handler)
