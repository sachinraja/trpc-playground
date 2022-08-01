import { PlaygroundRequestOperation, ResolvedRouterSchema } from '@trpc-playground/types'

type BodyObject = Record<string, unknown>

type MakePlaygroundRequestOptions = {
  playgroundEndpoint: string
  body?: BodyObject
}

export async function makePlaygroundRequest(
  operation: 'getRouterSchema',
  options: MakePlaygroundRequestOptions,
): Promise<ResolvedRouterSchema>

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

  return response.json()
}
