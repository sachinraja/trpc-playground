import { AnyRouter } from '@trpc/server'
import { ZodAny } from 'zod'
import { printNode, zodToTs } from 'zod-to-ts'

const joinQueries = (functionName: string, queries: Record<string, { inputParser: ZodAny }>) => {
  const queryNames: string[] = []

  const queryTypes = Object.entries(queries).map(([name, query]) => {
    const stringName = `'${name}'`
    queryNames.push(stringName)

    if (!query.inputParser._def) return
    const { node } = zodToTs(query.inputParser as ZodAny)

    const inputType = printNode(node)
    const queryType = `QueryName extends ${stringName} ? ${inputType}`
    return queryType
  })

  const filteredQueryTypes = queryTypes.filter((value): value is string => typeof value === 'string')

  const joinedQueryNames = queryNames.join(' | ')
  const args = ['name: QueryName']
  if (filteredQueryTypes.length > 0) {
    const joinedQueryTypes = filteredQueryTypes.length > 0 ? `${filteredQueryTypes.join(' : ')} : never` : 'never'
    args.push(`input: ${joinedQueryTypes}`)
  }

  return `declare function ${functionName}<QueryName extends ${joinedQueryNames}>(${args.join(',')}): void`
}

export const zodResolveTypes = (router: AnyRouter) => [
  joinQueries('query', router._def.queries),
  joinQueries('mutation', router._def.mutations),
]
