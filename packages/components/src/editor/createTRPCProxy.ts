interface ProxyCallbackOptions {
  path: string[]
  args: unknown[]
}
type ProxyCallback = (opts: ProxyCallbackOptions) => unknown

type ClientCallbacks = Record<string, (path: string, args: unknown) => void>

export const createTRPCProxy = (client: ClientCallbacks) => {
  return createProxy(({ args, path }) => {
    const clientCallType = path.pop()!
    if (!['query', 'mutate'].includes(clientCallType)) return

    const fullPath = path.join('.')
    return client[clientCallType](fullPath, args[0])
  })
}

const createProxy = (cb: ProxyCallback, ...path: string[]) => {
  const proxy: unknown = new Proxy(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {},
    {
      get(_target, name) {
        if (typeof name === 'string') {
          return createProxy(cb, ...path, name)
        }
      },
      apply(_1, _2, args) {
        return cb({ args, path })
      },
    },
  )

  return proxy
}
