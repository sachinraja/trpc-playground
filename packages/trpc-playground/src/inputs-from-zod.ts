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

  if (!object.properties) return inputs

  Object.entries(object.properties).forEach(([name, props]: [string, any]) => {
    let input: Property = {
      array: false,
      arrayTypes: [],
      name,
      type: [],
      nestedProps: [],
      literalValue: undefined,
      enumValues: null,
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
  ret: NonNullable<InputType>,
): NonNullable<InputType> => {
  let rootTypes: Set<string> = new Set()

  for (let prop of anyOfObject) {
    if ('not' in prop) rootTypes.add('undefined')
    else if (prop?.type === 'object') {
      ret.properties = getInputsFromObject(prop)
      ret.arrayTypes.push('object')
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

// Get input types from tuple definition
const getTupleTypes = (items: any[]) => {
  const inputs: Property[] = []

  for (const item of items) {
    let queryInput: Property = {
      array: false,
      arrayTypes: [],
      enumValues: null,
      literalValue: undefined,
      name: '',
      nestedProps: [],
      type: [],
    }

    if ('type' in item) {
      switch (item.type) {
        case 'object': {
          queryInput.nestedProps = getInputsFromObject(item)
          queryInput.type.push('object')
          break
        }

        case 'array': {
          // queryInput = getTypesFromArray(item)
          queryInput.type.push('array')
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
      // queryInput = getTypesFromAnyOfObject(item.anyOf, queryInput)
    }

    inputs.push(queryInput)
  }

  return inputs
}

// Get input types from array like definitions: [Array, Tuple]
const getTypesFromArray = (def: any): InputType | null => {
  const { items } = def

  // True if definition is tuple
  if (Array.isArray(items) && items.length == def.minItems && items.length == def.maxItems) {
    return {
      properties: getTupleTypes(items),
      rootTypes: [],
      tuple: true,
      array: false,
      arrayTypes: [],
      literalValue: undefined,
      enumValues: null,
    }
  } else {
    if ('type' in items) {
      if (items.type === 'object') {
        let properties = getInputsFromObject(items)

        return {
          properties,
          rootTypes: [],
          tuple: false,
          array: true,
          arrayTypes: ['object'],
          literalValue: undefined,
          enumValues: null,
        }
      } else {
        const arrayTypes = Array.isArray(items.type) ? items.type : [items.type]

        return {
          properties: [],
          rootTypes: [],
          array: true,
          tuple: false,
          arrayTypes,
          literalValue: undefined,
          enumValues: null,
        }
      }
    } else if ('anyOf' in items) {
      const arrayTypes = Array.from(getTypesFromAnyOf(items.anyOf))

      return {
        properties: [],
        rootTypes: [],
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

const defaultQueryInput: InputType = {
  properties: [],
  rootTypes: [],
  array: false,
  arrayTypes: [],
  literalValue: undefined,
  enumValues: null,
  tuple: false,
}

// Get Inputs for querybuilder by parsing trpc router into JSON schema
export const getInputs = (name: string, query: any): InputType => {
  let queryInput: InputType = { ...defaultQueryInput }

  if (typeof query.inputParser == 'function') return queryInput

  let def = zodToJsonSchema(query.inputParser, name).definitions[name] as any
  if (!def) return queryInput

  console.log(name, def, '\n')

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
        Array.isArray(def.type) ? queryInput.rootTypes = def.type : queryInput.rootTypes.push(def.type)

        if ('const' in def) queryInput.literalValue = def.const
        else if ('enum' in def) queryInput.enumValues = def.enum
        break
      }
    }
  } else if ('anyOf' in def) {
    queryInput = getTypesFromAnyOfObject(def.anyOf, queryInput)
  }

  console.log(queryInput, '\n')

  return queryInput
}
