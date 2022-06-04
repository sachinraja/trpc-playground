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
    if (!input?.array) {
      let inputsObject: string[] = []

      for (let [name, { type, value }] of Object.entries(state.inputs)) {
        if (type === 'undefined') continue
        if (type === 'null') inputsObject.push(`${name}: null`)
        else {
          if (type === 'string') {
            inputsObject.push(`${name}: "${value}"`)
          } else {
            inputsObject.push(`${name}: ${value}`)
          }
        }
      }

      inputs += `, { ${inputsObject.join(', ')} }`
    } else {
      if (state.inputs[state.operationName]) {
        let arrayItems: any[] = []
        Object.entries(state.inputs[state.operationName].value || {}).forEach(([_idx, val]) => {
          arrayItems.push(val)
        })

        inputs += `, [${arrayItems.join(', ')}]`
      }
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
