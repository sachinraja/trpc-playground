import { GetTypesResponse } from '../../utils/playground-request'

interface GenerateFnInputs {
  operationName: string
  types: GetTypesResponse | null
}

export const getDefaultOperation = (
  { operationName, types }: GenerateFnInputs,
): { value: string; inputLength: number } | null => {
  if (!types) return null
  return (operationName in types.mutations ? types.mutations : types.queries)[operationName].default
}
