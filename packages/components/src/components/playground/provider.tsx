import { HtmlValidTrpcPlaygroundConfig } from '@trpc-playground/types'
import { createReactQueryHooks } from '@trpc/react'
import { AnyRouter } from '@trpc/server'
import { Atom, atom } from 'jotai'
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

/**
 * create type safe initialValues
 * @see https://jotai.org/docs/api/core#type-script
 */
const createInitialValues = () => {
  const initialValues: (readonly [Atom<unknown>, unknown])[] = []
  const get = () => initialValues
  const set = <Value,>(anAtom: Atom<Value>, value: Value) => {
    initialValues.push([anAtom, value])
  }
  return { get, set }
}

export const PlaygroundProvider = ({ config, children }: PlaygroundProviderProps) => {
  const queryClient = useMemo(() => new QueryClient(), [])
  const trpcClient = useMemo(() =>
    trpc.createClient({
      url: config.endpoint,
    }), [])

  const { get, set } = createInitialValues()
  set(trpcClientAtom, trpcClient)
  set(configAtom, config)

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
