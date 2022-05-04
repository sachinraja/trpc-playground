import { InputType, ResolveTypesReturn } from '@trpc-playground/types'
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

const getTypesFromRouter = (router: AnyRouter): { queries: { [key: string]: InputType }; mutations: string[] } => {
  let queries = Object.entries(router._def.queries).reduce((prev, [name, query]) => {
    prev[name] = getInputs(name, query as any)

    return prev
  }, {} as { [key: string]: InputType })

  let mutations = Object.entries(router._def.mutations).map(([name, query]) => {
    return name
  })

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
