import { PlaygroundRequestOperation } from '@trpc-playground/types'

type BodyObject = Record<string, unknown>

type MakePlaygroundRequestOptions = {
  playgroundEndpoint: string
  body?: BodyObject
}

export type Property = {
  name: string
  type: string[]
  array: boolean
  tuple: boolean
  properties: Property[]
  arrayTypes: string[]
  literalValue: any
  enumValues: null | any[]
}

export type GetTypesResponse = {
  raw: string[]
  queries: { [key: string]: Property | null }
  mutations: { [key: string]: Property | null }
}

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
