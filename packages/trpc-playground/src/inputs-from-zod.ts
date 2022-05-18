import { zodToJsonSchema } from 'zod-to-json-schema'
import { InputType, Property } from '../../types/src'

const getTypesFromAnyOf = (anyOf: any[], inputTypes: Set<string> = new Set()): Set<string> => {
  anyOf.forEach((prop: any) => {
    if (prop.type) inputTypes.add(prop.type)
    else if ('not' in prop) {
      inputTypes.add('undefined')
    } else if (prop.anyOf) {
      console.log(prop.anyOf)
      inputTypes = getTypesFromAnyOf(prop.anyOf, inputTypes)
    }
  })

  return inputTypes
}

const getInputsFromObject = (object: any): Property[] => {
  let inputs: Property[] = []

  Object.entries(object.properties).forEach(([name, props]: [string, any]) => {
    let input: Property = {
      array: false,
      arrayTypes: [],
      name,
      type: [],
      nestedProps: [],
    }

    if ('type' in props) {
      if (props.type === 'object') {
        const objInputs = getInputsFromObject(props)
        input.type = ['object']
        input.nestedProps = objInputs
      } else if (props.type === 'array') {
        input.array = true

        const nestedArrayType = getTypesFromArray(props.items)
        if (nestedArrayType) {
          input.type = ['array', ...nestedArrayType.rootTypes]
          input.arrayTypes = nestedArrayType.arrayTypes
          input.nestedProps = nestedArrayType.properties
          nestedArrayType.rootTypes
        }
      } else {
        if (Array.isArray(props.type)) props.type.forEach((type: string) => input.type.push(type))
        else input.type.push(props.type)
      }
    }
    if (!object.required?.includes(name)) input.type.push('undefined')

    if ('anyOf' in props) {
      input.type = Array.from(getTypesFromAnyOf(props.anyOf, new Set(input.type)))
    }

    inputs.push(input)
  })

  return inputs
}

export const getInputs = (name: string, query: any): InputType => {
  let queryInput: InputType = {
    properties: [],
    rootTypes: [],
    array: false,
    arrayTypes: [],
  }

  if (typeof query.inputParser == 'function') return queryInput

  let def = zodToJsonSchema(query.inputParser, name).definitions[name] as any
  if (!def) return queryInput

  if ('type' in def) {
    if (def.type === 'object') {
      queryInput = { properties: getInputsFromObject(def), rootTypes: [], array: false, arrayTypes: [] }
    } else if (def.type === 'array') {
      queryInput = getTypesFromArray(def.items)
    } else {
      queryInput.rootTypes.push(def.type)
    }
  } else if ('anyOf' in def) {
    queryInput = getTypesFromAnyOfObject(def.anyOf, queryInput)
  }

  return queryInput
}

const getTypesFromAnyOfObject = (
  anyOfObject: any[],
  ret: NonNullable<InputType>,
): NonNullable<InputType> => {
  let rootTypes: Set<string> = new Set()

  for (let prop of anyOfObject) {
    if ('not' in prop) rootTypes.add('undefined')
    else if (prop?.type === 'object') {
      ret.properties = getInputsFromObject(prop)
    } else if (prop?.type === 'array') {
      ret.array = true

      const types = getTypesFromArray(prop.items)
      if (types) {
        ret.arrayTypes = types.arrayTypes
      }
    } else if ('anyOf' in prop) {
      let nested = getTypesFromAnyOfObject(prop.anyOf, ret)
      rootTypes = new Set(nested.rootTypes)
    } else if ('type' in prop && prop.type !== 'object') {
      rootTypes.add(prop.type)
    }
  }

  ret.rootTypes = Array.from(rootTypes)

  return ret
}

const getTypesFromArray = (items: any): InputType | null => {
  if ('type' in items) {
    if (items.type === 'object') {
      let properties = getInputsFromObject(items)
      return { properties, rootTypes: [], array: true, arrayTypes: [] }
    } else {
      const arrayTypes = Array.isArray(items.type) ? items.type : [items.type]
      return { properties: [], rootTypes: [], array: true, arrayTypes }
    }
  } else if ('anyOf' in items) {
    const arrayTypes = Array.from(getTypesFromAnyOf(items.anyOf))

    return { properties: [], rootTypes: [], array: true, arrayTypes }
  }

  return null
}
