import { cdnHtml } from '@trpc-playground/html'
import { NextApiHandler } from 'next'
import { resolveTypes } from '..'
import { TrpcPlaygroundOptions } from './types'

export const nextHandler = ({ router }: TrpcPlaygroundOptions): NextApiHandler => {
  return (req, res) => {
    console.log(req.url)
    if (req.method === 'GET') {
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.end(cdnHtml)
    } else if (req.method === 'POST') {
      console.log(req.body)
      const types = resolveTypes(router)
      res.json(types)
    }
  }
}
