import { HtmlValidTrpcPlaygroundConfig } from '@trpc-playground/types'
import { createReactQueryHooks } from '@trpc/react'
import { AnyRouter } from '@trpc/server'
import { atom } from 'jotai'
import { Provider as JotaiProvider } from 'jotai'
import { ComponentChildren } from 'preact'
import { useMemo } from 'preact/hooks'
import { QueryClient, QueryClientProvider } from 'react-query'

// need to pass in AnyRouter to satisfy rollup-plugin-dts
export const trpc = createReactQueryHooks<AnyRouter>()

type PlaygroundProviderProps = {
  config: HtmlValidTrpcPlaygroundConfig
  children: ComponentChildren
}

type TrpcClient = ReturnType<typeof trpc.createClient>
export const trpcClientAtom = atom<TrpcClient>(null!)
export const configAtom = atom<HtmlValidTrpcPlaygroundConfig>(null!)

export const PlaygroundProvider = ({ config, children }: PlaygroundProviderProps) => {
  const queryClient = useMemo(() => new QueryClient(), [])
  const trpcClient = useMemo(() =>
    trpc.createClient({
      url: config.endpoint,
    }), [])

  return (
    <div className='trpc-playground'>
      <JotaiProvider
        initialValues={[
          [trpcClientAtom, trpcClient],
          [configAtom, config],
        ]}
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
