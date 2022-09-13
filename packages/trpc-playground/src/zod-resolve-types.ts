import { ResolvedRouterSchema } from '@trpc-playground/types'
import { AnyRouter, Procedure } from '@trpc/server'
import _ from 'lodash'
import { ZodAny } from 'zod'
import { printNode, zodToTs } from 'zod-to-ts'
import { getDefaultForProcedures } from './get-default-input'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Procedures = Record<string, Procedure<any>>

const buildTrpcTsType = (router: AnyRouter) => {
  const procedures = router._def.procedures as Procedures
  const procedureObject = {} as Record<string, string>

  Object.entries(procedures).forEach(([name, procedure]) => {
    let procedureTypeDef = ``

    const inputTypes: string[] = []
    procedure._def.inputs.forEach((input: ZodAny) => {
      const { node } = zodToTs(input)
      inputTypes.push(printNode(node))
    })

    const joinedInputTypes = inputTypes.length ? `input: ${inputTypes.join('&')}` : ''

    if (procedure._def?.query) procedureTypeDef += `query: (${joinedInputTypes}) => void,`
    else if (procedure._def?.mutation) procedureTypeDef += `mutate: (${joinedInputTypes}) => void,`

    _.set(procedureObject, name, `{${procedureTypeDef}}`)
  })

  const buildNestedTrpcObject = (obj: Record<string, string>): string => {
    return Object.entries(obj).map(([name, value]) => {
      if (typeof value === 'string') return `'${name}': ${value}`
      return `'${name}': {${buildNestedTrpcObject(value)}}`
    }).join(',')
  }

  return `type Trpc = {${buildNestedTrpcObject(procedureObject)}}\ndeclare var trpc: Trpc;`
}

export const zodResolveTypes = async (router: AnyRouter): Promise<ResolvedRouterSchema> => ({
  tsTypes: buildTrpcTsType(router),
  ...getDefaultForProcedures(router._def.procedures),
})
