import { maskedEval } from '@trpc-playground/query-extension'
import { printObject, transformTs } from '@trpc-playground/utils'
import { TrpcClient } from '../types'

type TransformAndRunQueryArgs = { code: string; trpcClient: TrpcClient }
export const transformAndRunQueries = async ({ code, trpcClient }: TransformAndRunQueryArgs) => {
  // if the code exited because a failed query
  let didQueryFail = false

  const queryResponses: unknown[] = []
  try {
    // transform imports because export {} does not make sense in eval function
    const transformedCode = transformTs(code)

    await maskedEval(transformedCode, {
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
      async mutation(path: string, args: never) {
        try {
          const response = await trpcClient.mutation(path, args)
          queryResponses.push(response)
          return response
        } catch (e) {
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
