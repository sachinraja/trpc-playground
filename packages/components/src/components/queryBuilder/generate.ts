import { GetTypesResponse } from '../../utils/playground-request'
import { QueryBuilderState } from '.'

interface GenerateFnInputs {
  state: QueryBuilderState
  types: GetTypesResponse | null
}

export const generate = ({ state, types }: GenerateFnInputs): string | null => {
  if (state.operationType === null || state.operationName === null || state.operationTypeInObject === null || !types) {
    return null
  }
  let input = (types as any)[state.operationTypeInObject]?.[state.operationName]

  let inputs: string = '',
    output: string = 'await '
  if (state.inputsType === 'null') inputs += ', null'
  else if (state.inputsType === null) {
    if (input?.array || input?.tuple) {
      inputs += `, ${generateArrayInputs(state.inputs)}`
    } else if (input.properties.length !== 0) {
      inputs += `, ${generateObjectInputs(state.inputs)}`
    } else if (input.type.length !== 0) {
      inputs += `, ${
        formatPrimitive(state.inputs[state.operationName!].value, state.inputs[state.operationName!].type)
      }`
    }
  }

  switch (state.operationType) {
    case 'Mutation':
      output += 'mutate'
      break
    case 'Query':
      output += 'query'
      break
  }

  output += `('${state.operationName}'${inputs})`
  return output
}

const generateArrayInputs = (inputs: { [key: string]: any }): string => {
  let arrayItems: any[] = []

  Object.entries(inputs || {}).forEach(([_idx, val]) => {
    if (val.type === 'array') {
      arrayItems.push(generateArrayInputs(val.value))
    } else if (val.type === 'object') {
      arrayItems.push(generateObjectInputs(val.value))
    } else arrayItems.push(formatPrimitive(val.value, val.type))
  })

  return `[${arrayItems.join(', ')}]`
}

const generateObjectInputs = (inputs: { [key: string]: any }): string => {
  let inputsObject: string[] = []

  for (let [name, { type, value }] of Object.entries(inputs)) {
    if (type === 'undefined') continue
    if (type === 'null') inputsObject.push(`${name}: null`)
    else {
      inputsObject.push(`${name}: ${formatPrimitive(value, type)}`)
    }
  }

  return `{ ${inputsObject.join(', ')} }`
}

const formatPrimitive = (value: string, type: string) => type === 'string' ? `"${value}"` : `${value}`
