import { GetTypesResponse } from '../../utils/playground-request'
import { QueryBuilderState } from './queryBuilderState'

interface GenerateFnInputs {
  state: QueryBuilderState
  types: GetTypesResponse | null
}

// Generate code snippet of selected query and inputs
export const generate = ({ state, types }: GenerateFnInputs): { generated: string; inputLength: number } | null => {
  if (state.operationType === null || state.operationName === null || state.operationTypeInObject === null || !types) {
    return null
  }
  let output: string = 'await '

  switch (state.operationType) {
    case 'Mutation':
      output += 'mutation'
      break
    case 'Query':
      output += 'query'
      break
  }

  const input = getQueryDefaultInput({ state, types })
  output += `('${state.operationName}'${input})`
  return { generated: output, inputLength: input.length }
}

// Get default generated input for query from types response
const getQueryDefaultInput = ({ state, types }: GenerateFnInputs) => {
  if (!types || !state.operationTypeInObject) return ''

  const op = ((types as any)[state.operationTypeInObject]?.[state.operationName!])
  if (!op) return ''
  return op.default ? `, ${op.default}` : ``
}
