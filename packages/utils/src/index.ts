import inspect from 'object-inspect'
import { transform } from 'sucrase-browser'
export const printObject = (obj: unknown) => inspect(obj, { indent: 2 })

export const transformTs = (code: string) =>
  transform(code, {
    transforms: ['typescript', 'imports'],
  }).code
