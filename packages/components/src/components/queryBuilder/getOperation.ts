import { GetTypesResponse, Property } from '../../utils/playground-request'

export const getOperationsFromType = (types: GetTypesResponse, operationType: string): { [key: string]: Property } =>
  ((types as any || {})[operationType]) || {}

export const getOperationInput = (types: GetTypesResponse, operationType: string, operationName: string): Property =>
  getOperationsFromType(types, operationType)[operationName]
