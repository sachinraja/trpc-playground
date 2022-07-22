import { PlaygroundRequestOperation } from '@trpc-playground/types'

type BodyObject = Record<string, unknown>

type MakePlaygroundRequestOptions = {
  playgroundEndpoint: string
  body?: BodyObject
}

export type DefaultOperationType = { value: string; inputLength: number }
export type QueryDefaultAndType = Record<string, { default: DefaultOperationType; type: string }>

export type GetTypesFromRouterReturn = {
  queries: QueryDefaultAndType
  mutations: QueryDefaultAndType
}

export type GetTypesResponse = {
  tsTypes: string[]
} & GetTypesFromRouterReturn

export async function makePlaygroundRequest(
  operation: 'getTypes',
  options: MakePlaygroundRequestOptions,
): Promise<GetTypesResponse>

export async function makePlaygroundRequest<Operation extends PlaygroundRequestOperation>(
  operation: Operation,
  { playgroundEndpoint, body }: MakePlaygroundRequestOptions,
) {
  const requestBody = JSON.stringify({ operation, ...body })

  const response = await fetch(playgroundEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: requestBody,
  })

  return response.json() as Promise<GetTypesResponse>
}
