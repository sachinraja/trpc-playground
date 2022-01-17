/**
 * @see https://github.com/trpc/trpc/blob/main/packages/server/src/adapters/node-http/internals/getPostBody.ts
 */
import { NodeHTTPRequest } from './types'

export const getPostBody = ({ req }: { req: NodeHTTPRequest }) => {
  return new Promise<
    { data: unknown }
  >((resolve) => {
    if (req.body) {
      resolve({ data: req.body })
      return
    }

    let body = ''
    let hasBody = false

    req.on('data', function(data) {
      body += data
      hasBody = true
    })

    req.on('end', () => {
      resolve({
        data: hasBody ? body : undefined,
      })
    })
  })
}
