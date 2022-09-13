import { ResolvedRouterSchema } from '@trpc-playground/types'
import {
  ZodAny,
  ZodArrayDef,
  ZodEnumDef,
  ZodFirstPartyTypeKind,
  ZodIntersectionDef,
  ZodLiteralDef,
  ZodMapDef,
  ZodNativeEnumDef,
  ZodNullableDef,
  ZodObjectDef,
  ZodOptionalDef,
  ZodPromiseDef,
  ZodRecordDef,
  ZodSetDef,
  ZodTupleDef,
  ZodUnionDef,
} from 'zod'
import { printNode, zodToTs } from 'zod-to-ts'
import { Procedures } from './zod-resolve-types'

export const getDefaultForProcedures = (procedures: Procedures) => {
  const defaultForQueries: Pick<ResolvedRouterSchema, 'queries' | 'mutations'> = { mutations: {}, queries: {} }

  Object.entries(procedures)
    .filter(([, { _def }]) => _def.query || _def.mutation)
    .forEach(([procedureName, procedure]) => {
      let defaultInputValue = ''
      let type = ''
      procedure._def.inputs.forEach((input: ZodAny) => {
        defaultInputValue = getDefaultForDef(input._def)
        const { node } = zodToTs(input)
        type = printNode(node)
      })

      const defaultForQuery = {
        inputLength: defaultInputValue.length,
        value: `await trpc.${procedureName}.${procedure._def.query ? 'query' : 'mutate'}(${defaultInputValue})`,
      }

      if (procedure._def.query) defaultForQueries.queries[procedureName] = { default: defaultForQuery, type }
      else defaultForQueries.mutations[procedureName] = { default: defaultForQuery, type }
    })

  return defaultForQueries
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDefaultForDef = (def: any): string => {
  if (!def) return ''

  switch (def.typeName) {
    case ZodFirstPartyTypeKind.ZodString:
      return defaultString()
    case ZodFirstPartyTypeKind.ZodDate:
      return defaultDate()
    case ZodFirstPartyTypeKind.ZodNumber:
      return defaultNumber()
    case ZodFirstPartyTypeKind.ZodBigInt:
      return defaultBigInt()
    case ZodFirstPartyTypeKind.ZodBoolean:
      return defaultBoolean()
    case ZodFirstPartyTypeKind.ZodUndefined:
      return defaultUndefined()
    case ZodFirstPartyTypeKind.ZodNull:
      return defaultNull()
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
    default:
      return ''
  }
}

const defaultString = () => {
  return `""`
}

const defaultDate = () => {
  return `new Date()`
}

const defaultNumber = () => {
  return `0`
}

const defaultBigInt = () => {
  return `BigInt(0)`
}

const defaultBoolean = () => {
  return `false`
}

const defaultUndefined = () => {
  return `undefined`
}

const defaultNull = () => {
  return `null`
}

const defaultObject = (def: ZodObjectDef) => {
  let ret = `{ `

  const entries = Object.entries(def.shape())
  entries.forEach(([name, propDef], idx) => {
    ret += `${name}: ${getDefaultForDef(propDef._def)}`
    if (idx !== entries.length - 1) ret += `, `
    else ret += ` `
  })
  ret += `}`

  return ret
}

const defaultArray = (def: ZodArrayDef) => {
  return `[${getDefaultForDef(def.type._def)}]`
}

const defaultTuple = (def: ZodTupleDef) => {
  let ret = `[`
  for (let i = 0; i < def.items.length; i++) {
    const item = def.items[i]
    ret += `${getDefaultForDef(item._def)}`
    if (i !== def.items.length - 1) ret += ``
  }

  return ret
}

const defaultRecord = (_def: ZodRecordDef) => {
  return `{ ${getDefaultForDef(_def.keyType._def)}: ${getDefaultForDef(_def.valueType._def)} }`
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
  return `new Map([[${getDefaultForDef(_def.keyType._def)}, ${getDefaultForDef(_def.valueType._def)}]])`
}

const defaultSet = (_def: ZodSetDef) => {
  return `new Set([${getDefaultForDef(_def.valueType._def)}])`
}

const defaultPromise = (def: ZodPromiseDef) => {
  return `Promise.resolve(${getDefaultForDef(def.type._def)})`
}
