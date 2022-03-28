/**
 * @see https://github.com/trpc/trpc/blob/main/packages/server/src/adapters/node-http/internals/getPostBody.ts
 */
import { TRPCError } from '@trpc/server'
import { NodeHTTPRequest } from './types'

type GetPostBodyArgs = {
  req: NodeHTTPRequest
  maxBodySize?: number
}
export const getPostBody = ({ req, maxBodySize }: GetPostBodyArgs) => {
  return new Promise<
    { ok: true; data: unknown } | { ok: false; error: Error }
  >((resolve) => {
    if (req.body) {
      resolve({ ok: true, data: req.body })
      return
    }

    let body = ''
    let hasBody = false

    req.on('data', (data) => {
      body += data
      hasBody = true

      if (typeof maxBodySize === 'number' && body.length > maxBodySize) {
        resolve({
          ok: false,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore https://github.com/trpc/trpc/issues/1588
          error: new TRPCError({ code: 'PAYLOAD_TOO_LARGE' }),
        })
        req.socket.destroy()
      }
    })

    req.on('end', () => {
      resolve({
        ok: true,
        data: hasBody ? body : undefined,
      })
    })
  })
}
