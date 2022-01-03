import { PlaygroundRequestOperation, TrpcPlaygroundConfig } from '@trpc-playground/types'
import { NextApiHandler } from 'next'
import { resolveTypes } from '..'
import { renderPlaygroundPage } from '../render'

export const nextHandler = (config: TrpcPlaygroundConfig): NextApiHandler => {
  const { router } = config
  const htmlPage = renderPlaygroundPage(config)

  return (req, res) => {
    switch (req.method) {
      case 'GET': {
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(htmlPage)
        break
      }

      case 'POST': {
        const body = JSON.parse(req.body)
        const operation: PlaygroundRequestOperation = body.operation

        if (operation === 'getTypes') {
          const types = resolveTypes(router)
          res.json(types)
        } else {
          // not a valid operation, 400 Bad Request
          res.status(400).end()
        }
        break
      }
    }
  }
}
