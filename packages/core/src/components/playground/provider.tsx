import { createReactQueryHooks } from '@trpc/react'
import { FunctionalComponent } from 'preact'
import { useMemo } from 'preact/hooks'
import { QueryClient, QueryClientProvider } from 'react-query'

export const trpc = createReactQueryHooks()

export const client = trpc.createClient({
  url: 'http://localhost:3000/api/trpc',
})

export const PlaygroundProvider: FunctionalComponent = ({ children }) => {
  const queryClient = useMemo(() => new QueryClient(), [])

  return (
    <div className='trpc-playground'>
      <trpc.Provider client={client} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    </div>
  )
}
