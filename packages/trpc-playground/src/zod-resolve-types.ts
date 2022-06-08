import { Property, ResolveTypesReturn } from '@trpc-playground/types'
import { AnyRouter } from '@trpc/server'
import { ZodAny } from 'zod'
import { printNode, zodToTs } from 'zod-to-ts'
import { getInputs } from './inputs-from-zod'

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

interface GetTypesFromRouterReturn {
  queries: { [key: string]: Property | null }
  mutations: { [key: string]: Property | null }
}

const getTypesFromRouter = (router: AnyRouter): GetTypesFromRouterReturn => {
  let queries = Object.entries(router._def.queries).reduce((prev, [name, query]) => {
    prev[name] = getInputs(name, query)

    return prev
  }, {} as { [key: string]: Property | null })
  console.log(queries)

  let mutations = Object.entries(router._def.mutations).reduce((prev, [name, mutation]) => {
    prev[name] = getInputs(name, mutation as any)

    return prev
  }, {} as { [key: string]: Property | null })

  return {
    mutations,
    queries,
  }
}

export const zodResolveTypes = async (router: AnyRouter): Promise<ResolveTypesReturn> => ({
  raw: [
    joinQueries('query', router._def.queries),
    joinQueries('mutation', router._def.mutations),
  ],
  ...getTypesFromRouter(router),
})

const foo = <T extends string | number>(
  first: T,
  ...a: (T extends string ? [boolean] : [undefined])
) => undefined
