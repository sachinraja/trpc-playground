import { zodToJsonSchema } from 'zod-to-json-schema'
import { InputType, Property } from '../../types/src'

const getTypesFromAnyOf = (anyOf: any[], inputTypes: Set<string>): Set<string> => {
  anyOf.forEach((prop: any) => {
    if (prop.type) inputTypes.add(prop.type)
    else if (prop.anyOf) {
      inputTypes = getTypesFromAnyOf(prop.anyOf, inputTypes)
    }
  })

  return inputTypes
}

const getInputsFromObject = (object: any): Property[] => {
  let inputs: Property[] = []

  Object.entries(object.properties).forEach(([name, props]: [string, any]) => {
    let inputTypes: Set<string> = new Set()

    if (props?.type) {
      if (Array.isArray(props.type)) props.type.forEach((type: string) => inputTypes.add(type))
      else inputTypes.add(props.type)
    }
    if (!object.required?.includes(name)) inputTypes.add('undefined')

    if (props?.anyOf) {
      inputTypes = getTypesFromAnyOf(props.anyOf, inputTypes)
    }

    inputs.push({
      name,
      type: Array.from(inputTypes),
    })
  })

  return inputs
}

export const getInputs = (name: string, query: any): InputType => {
  let queryInput: InputType = {
    properties: [],
    rootTypes: [],
  }

  if (typeof query.inputParser == 'function') return queryInput

  let def = zodToJsonSchema(query.inputParser, name).definitions[name] as any
  if (!def) return queryInput

  if ('type' in def) {
    if (def.type !== 'object') {
      queryInput.rootTypes.push(def.type)
    } else {
      queryInput = { properties: getInputsFromObject(def), rootTypes: [] }
    }
  } else if ('anyOf' in def) {
    let { rootTypes, objectInputs } = getTypesFromAnyOfObject(def.anyOf, { rootTypes: new Set(), objectInputs: [] })
    queryInput = { properties: objectInputs, rootTypes: Array.from(rootTypes) }
  }

  return queryInput
}

type GetTypesFromAnyOfObjectReturn = {
  rootTypes: Set<string>
  objectInputs: Property[]
}

const getTypesFromAnyOfObject = (
  anyOfObject: any[],
  ret: GetTypesFromAnyOfObjectReturn,
): GetTypesFromAnyOfObjectReturn => {
  for (let prop of anyOfObject) {
    if ('not' in prop) ret.rootTypes.add('undefined')
    else if ('type' in prop && prop.type !== 'object') {
      ret.rootTypes.add(prop.type)
    } else if (prop?.type === 'object') {
      ret.objectInputs = getInputsFromObject(prop)
    } else if ('anyOf' in prop) {
      let nested = getTypesFromAnyOfObject(prop.anyOf, ret)
      ret.rootTypes = nested.rootTypes
    }
  }

  return ret
}
