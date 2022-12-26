import { ResolvedRouterSchema } from '@trpc-playground/types'
import { AnyProcedure, AnyRouter } from '@trpc/server'
import lodash from 'lodash'
import { AnyZodObject, z, ZodAny, ZodTypeAny } from 'zod'
import { createTypeAlias, printNode, zodToTs } from 'zod-to-ts'
import { getDefaultForProcedures } from './get-default-input'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Procedures = Record<string, AnyProcedure>

const buildTrpcTsType = (router: AnyRouter) => {
  const procedures = router._def.procedures as Procedures
  const procedureObject = {} as Record<string, string>

  Object.entries(procedures)
    .filter(([, { _def }]) => _def.query || _def.mutation)
    .forEach(([name, procedure]) => {
      let procedureTypeDef = ``

      const inputParser = getInputFromInputParsers(procedure._def.inputs)
      const inputType = inputParser ? printTypeFromInputParser(inputParser) : ''

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

export const zodResolveTypes = async (router: AnyRouter): Promise<ResolvedRouterSchema> => ({
  tsTypes: buildTrpcTsType(router),
  ...getDefaultForProcedures(router._def.procedures),
})

export const getInputFromInputParsers = (inputs: ZodAny[]) => {
  if (inputs.length === 0) return null
  if (inputs.length === 1) return inputs[0]

  let mergedObj = z.object({})
  inputs.forEach((inputParser) => {
    mergedObj = mergedObj.merge(inputParser as unknown as AnyZodObject)
    if (inputParser.description) {
      mergedObj = mergedObj.describe(inputParser.description)
    }
  })

  return mergedObj
}

export const printTypeFromInputParser = (inputParser: ZodTypeAny) => {
  const { node } = zodToTs(inputParser)

  return `input: ${printNode(node)}`
}

export const printTypeForDocs = (inputParser: ZodTypeAny) => {
  const { node } = zodToTs(inputParser)

  return printNode(createTypeAlias(node, 'input', inputParser.description))
}
