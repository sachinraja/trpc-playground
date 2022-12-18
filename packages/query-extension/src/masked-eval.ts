export const maskedEval = async (code: string, context: Record<string, unknown>) => {
  const globalContext = { exports: {} }
  const mask = { ...globalContext, ...context }

  const asyncFunc = (new Function(`return async() => { with(this) {${code}} }`)).call(mask)
  return asyncFunc()
}
