import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DeepRequiredClientConfig, ResolvedRouterSchema } from '@trpc-playground/types'
import { createTRPCReact } from '@trpc/react'
import { AnyRouter } from '@trpc/server'
import { atom, Provider as JotaiProvider } from 'jotai'
import { ComponentChildren } from 'preact'
import { useCallback, useMemo } from 'preact/hooks'
import superjson from 'superjson'
import { TrpcClient } from '../types'
import { getInitialState } from './tab/store'
import { createInitialValues } from './utils'

// need to pass in AnyRouter to satisfy rollup-plugin-dts
export const trpc = createTRPCReact<AnyRouter>()

type PlaygroundProviderProps = {
  config: DeepRequiredClientConfig
  children: ComponentChildren
}

export const trpcClientAtom = atom<TrpcClient>(null!)
export const configAtom = atom<DeepRequiredClientConfig>(null!)
export const typesAtom = atom<ResolvedRouterSchema | null>(null)

export const PlaygroundProvider = ({ config, children }: PlaygroundProviderProps) => {
  const queryClient = useMemo(() => new QueryClient(), [])

  // Merge headers in config and global headers from localstorage
  const getHeaders = useCallback(
    () => ({ ...config.request.globalHeaders, ...getInitialState().headers }),
    [config.request.globalHeaders],
  )

  const transformer = config.request.superjson ? superjson : undefined
  const trpcClient = useMemo(() =>
    trpc.createClient({
      url: config.trpcApiEndpoint,
      headers: getHeaders,
      transformer,
    }), [])

  const { get, set } = createInitialValues()
  set(trpcClientAtom, trpcClient)
  set(configAtom, config)
  set(typesAtom, null)

  return (
    <div className='trpc-playground'>
      <JotaiProvider
        initialValues={get()}
      >
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </trpc.Provider>
      </JotaiProvider>
    </div>
  )
}
