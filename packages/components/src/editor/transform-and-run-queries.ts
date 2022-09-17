import { maskedEval } from '@trpc-playground/query-extension'
import { printObject, transformTs } from '@trpc-playground/utils'
import { TrpcClient } from '../types'
import { createTRPCProxy } from './createTRPCProxy'

type EvalArgs = {
  code: string
  trpcClient: TrpcClient
}

type EvalFunction = (args: EvalArgs) => Promise<string>

type TransformAndRunQueryArgs = {
  code: string
  trpcClient: TrpcClient
  evalFunction: EvalFunction
}

export const transformAndRunQueries = async ({ code, trpcClient, evalFunction }: TransformAndRunQueryArgs) => {
  let transformedCode: string
  try {
    transformedCode = transformTs(code)
  } catch (e) {
    return printObject(e)
  }

  return evalFunction({ code: transformedCode, trpcClient })
}

export const batchEval = async ({ code, trpcClient }: EvalArgs) => {
  try {
    // transform imports because export {} does not make sense in eval function
    const queries: ReturnType<TrpcClient['query']>[] = []
    const mutations: ReturnType<TrpcClient['mutation']>[] = []

    await maskedEval(code, {
      trpc: createTRPCProxy({
        async query(path, args) {
          queries.push(trpcClient.query(path, args))
        },
        async mutate(path, args) {
          mutations.push(trpcClient.mutation(path, args))
        },
      }),
    })

    const allSettledResponse = await Promise.allSettled([
      ...queries,
      ...mutations,
    ])

    const queryResponses = allSettledResponse.map((response) =>
      response.status === 'fulfilled' ? response.value : response.reason
    )

    return joinQueryResponses(queryResponses)
  } catch (e) {
    return printObject(e)
  }
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

  const responseObjectValue = joinQueryResponses(queryResponses)
  return responseObjectValue
}

const joinQueryResponses = (queryResponses: unknown[]) =>
  `${queryResponses.map((response) => printObject(response)).join(',\n\n')}`
