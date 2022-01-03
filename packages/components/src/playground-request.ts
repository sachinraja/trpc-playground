import { PlaygroundRequestOperation } from '@trpc-playground/types'

type BodyObject = Record<string, unknown>

export async function makePlaygroundRequest(
  operation: 'getTypes',
  body?: BodyObject,
): Promise<string[]>

export async function makePlaygroundRequest<Operation extends PlaygroundRequestOperation>(
  operation: Operation,
  body?: BodyObject,
) {
  const requestBody = JSON.stringify({ operation, ...body })

  const response = await fetch(window.location.href, {
    method: 'POST',
    body: requestBody,
  })

  return response.json()
}
