export const maskedEval = async (x: string, context: Record<string, unknown>) => {
  const globalContext = { exports: {} }
  const mask = { ...globalContext, ...context }

  const asyncFunc = (new Function(`return async() => { with(this) {${x}} }`)).call(mask)
  return asyncFunc()
}
