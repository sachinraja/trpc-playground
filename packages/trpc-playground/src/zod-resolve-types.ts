import { AnyRouter } from '@trpc/server'
import { ZodAny } from 'zod'
import { printNode, zodToTs } from 'zod-to-ts'

export const zodResolveTypes = (router: AnyRouter) => {
  const queryNames: string[] = []
  const queryTypes = Object.entries(router._def.queries).map(([name, query]) => {
    const stringName = `'${name}'`
    queryNames.push(stringName)

    // @ts-expect-error query type is not defined
    const { node } = zodToTs(query.inputParser as ZodAny)

    const inputType = printNode(node)
    const queryType = `QueryName extends ${stringName} ? ${inputType}`
    return queryType
  })

  const joinedQueryNames = queryNames.join(' | ')
  const joinedQueryTypes = `${queryTypes.join(' : ')} : never`

  queryTypes.push(
    `declare function query<QueryName extends ${joinedQueryNames}>(name: QueryName, input: ${joinedQueryTypes}): void`,
  )

  return queryTypes
}
