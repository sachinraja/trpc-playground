type UnknownObject = Record<string, unknown>

export const maskedEval = async (x: string, context: UnknownObject) => {
  const globalContext = { exports: {} }
  const mask = { ...globalContext, ...context }

  const asyncFunc = (new Function(`return async() => { with(this) {${x}} }`)).call(mask)
  console.log(await asyncFunc())
}
