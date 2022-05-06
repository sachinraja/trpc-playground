import { DeepRequiredClientConfig } from '@trpc-playground/types'
import { createReactQueryHooks } from '@trpc/react'
import { AnyRouter } from '@trpc/server'
import { atom } from 'jotai'
import { Provider as JotaiProvider } from 'jotai'
import { ComponentChildren } from 'preact'
import { useMemo } from 'preact/hooks'
import { QueryClient, QueryClientProvider } from 'react-query'
import superjson from 'superjson'
import { TrpcClient } from '../types'
import { GetTypesResponse } from '../utils/playground-request'
import { createInitialValues } from './utils'

// need to pass in AnyRouter to satisfy rollup-plugin-dts
export const trpc = createReactQueryHooks<AnyRouter>()

type PlaygroundProviderProps = {
  config: DeepRequiredClientConfig
  children: ComponentChildren
}

export const trpcClientAtom = atom<TrpcClient>(null!)
export const configAtom = atom<DeepRequiredClientConfig>(null!)
export const typesAtom = atom<GetTypesResponse | null>(null)

export const PlaygroundProvider = ({ config, children }: PlaygroundProviderProps) => {
  const queryClient = useMemo(() => new QueryClient(), [])

  const transformer = config.request.superjson ? superjson : undefined
  const trpcClient = useMemo(() =>
    trpc.createClient({
      url: config.trpcApiEndpoint,
      headers() {
        return config.request.globalHeaders
      },
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
