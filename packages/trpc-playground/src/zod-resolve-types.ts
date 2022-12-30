import { ResolvedRouterSchema } from '@trpc-playground/types'
import { AnyProcedure, AnyRouter } from '@trpc/server'
import lodash from 'lodash'
import { AnyZodObject, z, ZodAny } from 'zod'
import { getProcedureSchemas } from './get-default-input'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Procedures = Record<string, AnyProcedure>

export type ProcedureTypes = Record<'queries' | 'mutations', Record<string, string>>

const buildTrpcTsType = (router: AnyRouter, procedureTypes: ProcedureTypes) => {
  const procedures = router._def.procedures as Procedures
  const procedureObject = {} as Record<string, string>

  Object.entries(procedures)
    .filter(([, { _def }]) => _def.query || _def.mutation)
    .forEach(([name, procedure]) => {
      let procedureTypeDef = ''

      const inputType = procedureTypes.mutations[name] || procedureTypes.queries[name] || ''
      if (procedure._def?.query) procedureTypeDef += `query: (${inputType}) => void,`
      else if (procedure._def?.mutation) procedureTypeDef += `mutate: (${inputType}) => void,`

      lodash.set(procedureObject, name, `{${procedureTypeDef}}`)
    })

  const buildNestedTrpcObject = (obj: Record<string, string>): string => {
    return Object.entries(obj).map(([name, value]) => {
      if (typeof value === 'string') return `'${name}': ${value}`
      return `'${name}': {${buildNestedTrpcObject(value)}}`
    }).join(',')
  }

  return `type Trpc = {${buildNestedTrpcObject(procedureObject)}}\ndeclare var trpc: Trpc;`
}

export const zodResolveTypes = async (router: AnyRouter): Promise<ResolvedRouterSchema> => {
  const { schemas, types } = getProcedureSchemas(router._def.procedures)

  return {
    tsTypes: buildTrpcTsType(router, types),
    ...schemas,
  }
}

export const getInputFromInputParsers = (inputs: ZodAny[]) => {
  if (inputs.length === 0) return null
  if (inputs.length === 1) return inputs[0]

  const mergedObj = inputs.reduce((mergedObj, inputParser) => {
    return mergedObj.merge(inputParser as unknown as AnyZodObject)
  }, z.object({}))

  return mergedObj
}
