import inspect from 'object-inspect'

export const printObject = (obj: unknown) => inspect(obj, { indent: 2 })
