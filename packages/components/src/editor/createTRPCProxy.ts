interface ProxyCallbackOptions {
  path: string[]
  args: unknown[]
}
type ProxyCallback = (opts: ProxyCallbackOptions) => unknown

const clientCallTypeMap: Record<string, string> = {
  query: 'query',
  mutate: 'mutation',
}

export const createTRPCProxy = (client: Record<string, unknown>) => {
  return createProxy(({ args, path }) => {
    const clientCallType = path.pop()!

    const procedureType = clientCallTypeMap[clientCallType]
    if (!procedureType) return

    const fullPath = path.join('.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (client as any)[procedureType](fullPath, ...args)
  })
}

const createProxy = (cb: ProxyCallback, ...path: string[]) => {
  const proxy: unknown = new Proxy(
    {},
    {
      get(_target, name) {
        if (typeof name === 'string') {
          return createProxy(cb, ...path, name)
        }
      },
      apply(_1, _2, args) {
        cb({ args, path })
      },
    },
  )

  return proxy
}
