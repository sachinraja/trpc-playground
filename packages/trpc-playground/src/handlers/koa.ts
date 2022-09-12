import { getKoaAdapter } from 'uttp/adapters/koa'
import { handler } from '../handler'

export const koaHandler = getKoaAdapter(handler)
