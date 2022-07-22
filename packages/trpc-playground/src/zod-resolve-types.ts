import { AnyRouter } from '@trpc/server'
import { ZodAny } from 'zod'
import { printNode, zodToTs } from 'zod-to-ts'
import { generateSnippet } from './get-default-input'

type QueriesType = Record<string, { inputParser: ZodAny }>

const joinQueries = (functionName: string, queries: QueriesType) => {
  const queryNames: string[] = []

  const queryTypes = Object.entries(queries).map(([name, query]) => {
    const stringName = `'${name}'`
    queryNames.push(stringName)

    if (!query.inputParser._def) return `QueryName extends ${stringName} ? [undefined?]`
    const { node } = zodToTs(query.inputParser as ZodAny)

    const inputType = printNode(node)
    const queryType = `QueryName extends ${stringName} ? [${inputType}]`
    return queryType
  })

  const filteredQueryTypes = queryTypes.filter((value): value is string => typeof value === 'string')

  const joinedQueryNames = queryNames.join(' | ')
  const args = ['name: QueryName']

  const joinedQueryTypes = `${filteredQueryTypes.join(' : ')} : never`
  args.push(`...args: ${joinedQueryTypes}`)

  return `declare function ${functionName}<QueryName extends ${joinedQueryNames}>(${args.join(',')}): void`
}

type DefaultOperationType = { value: string; inputLength: number }
type QueryDefaultAndType = Record<string, { default: DefaultOperationType; type: string }>

export type GetTypesFromRouterReturn = {
  queries: QueryDefaultAndType
  mutations: QueryDefaultAndType
}

export type ResolveTypesReturn = {
  tsTypes: string[]
} & GetTypesFromRouterReturn

const getDefaultForOperations = (operations: QueriesType, operationType: string) =>
  Object.entries(operations).reduce(
    (prev, [name, { inputParser }]) => {
      prev[name] = generateSnippet(inputParser, { operationType, operationName: name })

      return prev
    },
    {} as QueryDefaultAndType,
  )

export const zodResolveTypes = async (router: AnyRouter): Promise<ResolveTypesReturn> => ({
  tsTypes: [
    joinQueries('query', router._def.queries),
    joinQueries('mutation', router._def.mutations),
  ],
  queries: getDefaultForOperations(router._def.queries, 'query'),
  mutations: getDefaultForOperations(router._def.mutations, 'mutation'),
})
