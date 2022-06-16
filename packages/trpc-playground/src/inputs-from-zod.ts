import { zodToJsonSchema } from 'zod-to-json-schema'
import { Property } from '../../types/src'

const getTypesFromAnyOf = (anyOf: any[], inputTypes: Set<string> = new Set()): Set<string> => {
  anyOf.forEach((prop: any) => {
    if (prop.type) inputTypes.add(prop.type)
    else if ('not' in prop) {
      inputTypes.add('undefined')
    } else if (prop.anyOf) {
      // console.log(prop.anyOf)
      inputTypes = getTypesFromAnyOf(prop.anyOf, inputTypes)
    }
  })

  return inputTypes
}

const getInputsFromObject = (object: any): Property[] => {
  let inputs: Property[] = []

  if (!object.properties) return inputs

  Object.entries(object.properties).forEach(([name, props]: [string, any]) => {
    let input: Property = {
      name,
      array: false,
      arrayTypes: [],
      type: [],
      properties: [],
      literalValue: undefined,
      enumValues: null,
      tuple: false,
    }

    if ('type' in props) {
      if (Array.isArray(props.items) && props.items.length == props.minItems && props.items.length == props.maxItems) {
        input.tuple = true
        input.properties = getTupleTypes(props.items)
        input.type.push('tuple')
      } else if (props.type === 'object') {
        const objInputs = getInputsFromObject(props)
        input.type = ['object']
        input.properties = objInputs
      } else if (props.type === 'array') {
        input.array = true

        const nestedArrayType = getTypesFromArray(props)
        input = nestedArrayType ?? input
        input.name = name
        input.type.push('array')
        // console.log(input)
        // input.type = ['array', ...nestedArrayType.type]
        // input.arrayTypes = nestedArrayType.arrayTypes
        // input.properties = nestedArrayType.properties
        // nestedArrayType.type
        // }
      } else {
        if (Array.isArray(props.type)) props.type.forEach((type: string) => input.type.push(type))
        else input.type.push(props.type)

        if ('const' in props) input.literalValue = props.const
        else if ('enum' in props) input.enumValues = props.enum
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

const getTypesFromAnyOfObject = (
  anyOfObject: any[],
  ret: Property,
): Property => {
  let rootTypes: Set<string> = new Set()

  for (let prop of anyOfObject) {
    if ('not' in prop) rootTypes.add('undefined')
    else if (prop?.type === 'object') {
      ret.properties = getInputsFromObject(prop)
      ret.arrayTypes.push('object')
    } else if (prop?.type === 'array') {
      ret.array = true

      const types = getTypesFromArray(prop)
      if (types) {
        ret.arrayTypes = types.arrayTypes
      }
    } else if ('anyOf' in prop) {
      let nested = getTypesFromAnyOfObject(prop.anyOf, ret)
      rootTypes = new Set(nested.type)
    } else if ('type' in prop && prop.type !== 'object') {
      rootTypes.add(prop.type)
    }
  }

  ret.type = Array.from(rootTypes)

  return ret
}

// Get input types from tuple definition
const getTupleTypes = (items: any[]) => {
  const inputs: Property[] = []

  for (const item of items) {
    let queryInput: Property | null = {
      array: false,
      arrayTypes: [],
      enumValues: null,
      literalValue: undefined,
      name: '',
      properties: [],
      type: [],
      tuple: false,
    }

    if ('type' in item) {
      switch (item.type) {
        case 'object': {
          queryInput.properties = getInputsFromObject(item)
          queryInput.type.push('object')
          break
        }

        case 'array': {
          queryInput = getTypesFromArray(item)
          queryInput?.type.push('array')
          break
        }

        default: {
          Array.isArray(item.type) ? queryInput.type = item.type : queryInput.type.push(item.type)

          if ('const' in item) queryInput.literalValue = item.const
          else if ('enum' in item) queryInput.enumValues = item.enum
          break
        }
      }
    } else if ('anyOf' in item) {
      queryInput = getTypesFromAnyOfObject(item.anyOf, queryInput)
    }

    queryInput && inputs.push(queryInput)
  }

  return inputs
}

// Get input types from array like definitions: [Array, Tuple]
const getTypesFromArray = (def: any): Property | null => {
  const { items } = def
  // console.log(def)

  // True if definition is tuple
  if (Array.isArray(items) && items.length == def.minItems && items.length == def.maxItems) {
    return {
      name: '',
      properties: getTupleTypes(items),
      type: [],
      tuple: true,
      array: false,
      arrayTypes: [],
      literalValue: undefined,
      enumValues: null,
    }
  } else {
    if ('type' in items) {
      // console.log(items.type)
      if (items.type === 'object') {
        let properties = getInputsFromObject(items)

        return {
          name: '',
          properties,
          type: [],
          tuple: false,
          array: true,
          arrayTypes: ['object'],
          literalValue: undefined,
          enumValues: null,
        }
        // } else if (items.type === "array") {
        //   console.log("HERE: ", getTypesFromArray(items))
      } else {
        const arrayTypes = Array.isArray(items.type) ? items.type : [items.type]

        return {
          name: '',
          properties: [],
          type: [],
          array: true,
          tuple: false,
          arrayTypes,
          literalValue: items.const ?? undefined,
          enumValues: items.enum ?? null,
        }
      }
    } else if ('anyOf' in items) {
      const arrayTypes = Array.from(getTypesFromAnyOf(items.anyOf))

      return {
        name: '',
        properties: [],
        type: [],
        array: true,
        tuple: false,
        arrayTypes,
        literalValue: undefined,
        enumValues: null,
      }
    }
  }

  return null
}

const defaultQueryInput: Property = {
  name: '',
  properties: [],
  type: [],
  array: false,
  arrayTypes: [],
  literalValue: undefined,
  enumValues: null,
  tuple: false,
}

// Get Inputs for querybuilder by parsing trpc router into JSON schema
export const getInputs = (name: string, query: any): Property | null => {
  let queryInput: Property | null = { ...defaultQueryInput, type: [], properties: [], arrayTypes: [] }

  if (typeof query.inputParser == 'function') return queryInput

  let def = zodToJsonSchema(query.inputParser, name).definitions[name] as any
  if (!def) return queryInput

  if ('type' in def) {
    switch (def.type) {
      case 'object': {
        queryInput.properties = getInputsFromObject(def)
        break
      }

      case 'array': {
        queryInput = getTypesFromArray(def)
        break
      }

      default: {
        Array.isArray(def.type) ? queryInput.type = def.type : queryInput.type.push(def.type)

        if ('const' in def) queryInput.literalValue = def.const
        else if ('enum' in def) queryInput.enumValues = def.enum
        break
      }
    }
  } else if ('anyOf' in def) {
    queryInput = getTypesFromAnyOfObject(def.anyOf, queryInput)
  }

  // console.log(name, queryInput, '\n')

  return queryInput
}
