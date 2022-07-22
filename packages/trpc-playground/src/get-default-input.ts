import { ZodAny } from 'zod'
import { printNode, zodToTs } from 'zod-to-ts'

type GenerateInput = {
  operationType: string
  operationName: string
}

// Generate code snippet for operation
export const generateSnippet = (inputParser: ZodAny, { operationType, operationName }: GenerateInput) => {
  const hasInput = !!inputParser?._def

  let output: string = `await ${operationType}`
  const input = hasInput ? getDefaultInput(inputParser) : ''
  const type = hasInput ? getOperationType(inputParser) : ''

  output += `('${operationName}'${input})`

  return {
    type,
    default: { value: output, inputLength: input.length },
  }
}

const getOperationType = (inputParser: ZodAny) => {
  const { node } = zodToTs(inputParser)
  return printNode(node)
}

// Get default input string for query/mutation defined in the router
const getDefaultInput = (inputParser: ZodAny): string => {
  if (typeof inputParser === 'function') return ''

  const defaultInput = getDefaultForDef(inputParser._def)
  return defaultInput ? `, ${defaultInput}` : ``
}

import {
  ZodArrayDef,
  ZodEnumDef,
  ZodFirstPartyTypeKind,
  ZodIntersectionDef,
  ZodLiteralDef,
  ZodMapDef,
  ZodNativeEnumDef,
  ZodNullableDef,
  ZodNumberDef,
  ZodObjectDef,
  ZodOptionalDef,
  ZodPromiseDef,
  ZodRecordDef,
  ZodSetDef,
  ZodStringDef,
  ZodTupleDef,
  ZodTypeDef,
  ZodUnionDef,
} from 'zod'

const getDefaultForDef = (def: any): string | undefined => {
  if (!def) return

  switch ((def as any).typeName) {
    case ZodFirstPartyTypeKind.ZodString:
      return defaultString(def)
    case ZodFirstPartyTypeKind.ZodDate:
      return defaultDate(def)
    case ZodFirstPartyTypeKind.ZodNumber:
      return defaultNumber(def)
    case ZodFirstPartyTypeKind.ZodBigInt:
      return defaultBigInt(def)
    case ZodFirstPartyTypeKind.ZodBoolean:
      return defaultBoolean(def)
    case ZodFirstPartyTypeKind.ZodUndefined:
      return defaultUndefined(def)
    case ZodFirstPartyTypeKind.ZodNull:
      return defaultNull(def)
    case ZodFirstPartyTypeKind.ZodObject:
      return defaultObject(def)
    case ZodFirstPartyTypeKind.ZodArray:
      return defaultArray(def)
    case ZodFirstPartyTypeKind.ZodTuple:
      return defaultTuple(def)
    case ZodFirstPartyTypeKind.ZodRecord:
      return defaultRecord(def)
    case ZodFirstPartyTypeKind.ZodLiteral:
      return defaultLiteral(def)
    case ZodFirstPartyTypeKind.ZodNullable:
      return defaultNullable(def)
    case ZodFirstPartyTypeKind.ZodOptional:
      return defaultOptional(def)
    case ZodFirstPartyTypeKind.ZodIntersection:
      return defaultIntersection(def)
    case ZodFirstPartyTypeKind.ZodEnum:
      return defaultEnum(def)
    case ZodFirstPartyTypeKind.ZodNativeEnum:
      return defaultNativeEnum(def)
    case ZodFirstPartyTypeKind.ZodMap:
      return defaultMap(def)
    case ZodFirstPartyTypeKind.ZodSet:
      return defaultSet(def)
    case ZodFirstPartyTypeKind.ZodPromise:
      return defaultPromise(def)
    case ZodFirstPartyTypeKind.ZodNaN:
      return 'NaN'
    case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
    case ZodFirstPartyTypeKind.ZodUnion:
      return defaultUnion(def)
  }
}

// TODO: Handle max/min length
const defaultString = (_def: ZodStringDef) => {
  return `""`
}

const defaultDate = (_def: ZodStringDef) => {
  return `new Date()`
}

// TODO: Handle max/min
const defaultNumber = (_def: ZodNumberDef) => {
  return `0`
}

const defaultBigInt = (_def: ZodNumberDef) => {
  return `BigInt(0)`
}

const defaultBoolean = (_def: ZodTypeDef) => {
  return `false`
}

const defaultUndefined = (_def: ZodTypeDef) => {
  return `undefined`
}

const defaultNull = (_def: ZodTypeDef) => {
  return `null`
}

const defaultObject = (def: ZodObjectDef) => {
  let ret = `{ `

  let entries = Object.entries(def.shape())
  entries.forEach(([name, propDef], idx) => {
    ret += `${name}: ${getDefaultForDef(propDef._def)}`
    if (idx != entries.length - 1) ret += `, `
    else ret += ` `
  })
  ret += `}`

  return ret
}

// TODO: Handle max/min length
const defaultArray = (_def: ZodArrayDef) => {
  return `[]`
}

const defaultTuple = (def: ZodTupleDef) => {
  let ret = `[`
  for (let i = 0; i < def.items.length; i++) {
    let item = def.items[i]
    ret += `${getDefaultForDef(item._def)}`
    if (i != def.items.length - 1) ret += ``
  }

  return ret
}

const defaultRecord = (_def: ZodRecordDef) => {
  return `{}`
}

const defaultLiteral = (def: ZodLiteralDef) => {
  return typeof def.value === 'string' ? `"${def.value}"` : `${def.value}`
}

const defaultNullable = (def: ZodNullableDef) => {
  return getDefaultForDef(def.innerType._def)
}

const defaultOptional = (def: ZodOptionalDef) => {
  return getDefaultForDef(def.innerType._def) ?? `undefined`
}

const defaultEnum = (def: ZodEnumDef) => {
  return `"${def.values[0]}"`
}

const defaultUnion = (def: ZodUnionDef) => {
  const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options
  if (options.length === 0) return ''
  return getDefaultForDef(options[0]._def)
}

// Does not work correctly
const defaultIntersection = (def: ZodIntersectionDef) => {
  return getDefaultForDef(def.right._def)
}

// don't know if this is the best solution
const defaultNativeEnum = (def: ZodNativeEnumDef) => {
  const val = Object.values(def.values)[Object.values(def.values).length - 1]
  if (val) {
    return typeof val === 'string' ? `"${val}"` : `${val}`
  }

  return ''
}

const defaultMap = (_def: ZodMapDef) => {
  return 'new Map()'
}

const defaultSet = (_def: ZodSetDef) => {
  return 'new Set()'
}

const defaultPromise = (def: ZodPromiseDef) => {
  return `Promise.resolve(${getDefaultForDef(def.type._def)})`
}

// ZodLazy
