import { AnyRouter } from '@trpc/server'
import { ZodAny } from 'zod'
import { printNode, zodToTs } from 'zod-to-ts'

export const resolveTypes = (router: AnyRouter) =>
  Object.entries(router._def.queries).map(([name, query]) => {
    // @ts-expect-error query type is not defined
    const { node } = zodToTs(query.inputParser as ZodAny)

    const inputType = printNode(node)

    const queryType = `declare function query(name: '${name}', input: ${inputType}): void`
    return queryType
  })
