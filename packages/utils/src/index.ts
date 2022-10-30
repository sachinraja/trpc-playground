import inspect from 'object-inspect'
import { transform } from 'sucrase-browser'

// print all nested objects by setting depth to 0
export const printObject = (obj: unknown) => inspect(obj, { indent: 2, depth: 0 })

export const transformTs = (code: string) =>
  transform(code, {
    transforms: ['typescript', 'imports'],
  }).code
