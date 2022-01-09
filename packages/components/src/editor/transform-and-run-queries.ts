import { transform } from 'sucrase-browser'
import { TrpcClient } from '../types'
import { maskedEval } from '../utils/masked-eval'
import { printObject } from '../utils/misc'

type TransformAndRunQueryArgs = { code: string; trpcClient: TrpcClient }
export const transformAndRunQueries = async ({ code, trpcClient }: TransformAndRunQueryArgs) => {
  // if the code exited because a failed query
  let didQueryFail = false

  const queryResponses: unknown[] = []
  try {
    // transform imports because export {} does not make sense in eval function
    const transformed = transform(code, {
      transforms: ['typescript', 'imports'],
    })

    await maskedEval(transformed.code, {
      async query(path: string, args: never) {
        try {
          const response = await trpcClient.query(path, args)
          queryResponses.push(response)
          return response
        } catch (e) {
          // add error response before throwing
          queryResponses.push(e)
          didQueryFail = true
          throw e
        }
      },
    })
  } catch (e) {
    // if the query failed, the response object is already set
    if (!didQueryFail) return printObject(e)
  }

  const responseObjectValue = `${queryResponses.map((response) => printObject(response)).join(',\n\n')}`
  return responseObjectValue
}
