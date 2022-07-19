import { AnyRouter } from '@trpc/server'
import { ZodAny } from 'zod'
import { printNode, zodToTs } from 'zod-to-ts'
import { getDefaultInput } from './get-default-input'

const joinQueries = (functionName: string, queries: Record<string, { inputParser: ZodAny }>) => {
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

type QueryDefaultAndType = Record<string, { default: string; type: string }>

interface GetTypesFromRouterReturn {
  queries: QueryDefaultAndType
  mutations: QueryDefaultAndType
}

type ResolveTypesReturn = {
  tsTypes: string[]
} & GetTypesFromRouterReturn

const getDefaultForOperations = (operations: any) => {
  return Object.entries(operations as Record<string, { inputParser: ZodAny }>).reduce(
    (prev, [name, op]) => {
      if (op.inputParser?._def) {
        const { node } = zodToTs((op as any).inputParser)
        prev[name] = {
          type: printNode(node),
          default: getDefaultInput(op),
        }
      } else prev[name] = { default: '', type: '' }

      return prev
    },
    {} as QueryDefaultAndType,
  )
}

export const zodResolveTypes = async (router: AnyRouter): Promise<ResolveTypesReturn> => ({
  tsTypes: [
    joinQueries('query', router._def.queries),
    joinQueries('mutation', router._def.mutations),
  ],
  queries: getDefaultForOperations(router._def.queries),
  mutations: getDefaultForOperations(router._def.mutations),
})
