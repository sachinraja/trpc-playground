import { createReactQueryHooks } from '@trpc/react'
import { FunctionalComponent } from 'preact'
import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

export const trpc = createReactQueryHooks()

const client = trpc.createClient({
  url: 'http://localhost:3000/api/trpc',
})

export const PlaygroundProvider: FunctionalComponent = ({ children }) => {
  const queryClient = useMemo(() => new QueryClient(), [])

  return (
    <trpc.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
