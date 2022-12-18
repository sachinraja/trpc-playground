import { maskedEval } from '@trpc-playground/query-extension'
import { printObject, transformTs } from '@trpc-playground/utils'
import { TrpcClient } from '../types'
import { createTRPCProxy } from './createTRPCProxy'

type TransformAndRunQueryArgs = {
  code: string
  trpcClient: TrpcClient
}

export const transformAndRunQueries = async ({ code, trpcClient }: TransformAndRunQueryArgs) => {
  let transformedCode: string
  try {
    transformedCode = transformTs(code)
  } catch (e) {
    return printObject(e)
  }

  return serialEval({ code: transformedCode, trpcClient })
}

type EvalArgs = {
  code: string
  trpcClient: TrpcClient
}

export const serialEval = async ({ code, trpcClient }: EvalArgs) => {
  // if the code exited because a failed query
  let didQueryFail = false

  const queryResponses: unknown[] = []

  try {
    // transform imports because export {} does not make sense in eval function

    await maskedEval(code, {
      trpc: createTRPCProxy(
        {
          async query(path, args) {
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
          async mutate(path, args) {
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
        },
      ),
    })
  } catch (e) {
    // if the query failed, the response object is already set
    if (!didQueryFail) return printObject(e)
  }

  return joinQueryResponses(queryResponses)
}

const joinQueryResponses = (queryResponses: unknown[]) =>
  `${queryResponses.map((response) => printObject(response)).join(',\n\n')}`
