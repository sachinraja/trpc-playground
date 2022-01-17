import { Playground } from '@trpc-playground/components'

export function App() {
  return (
    <Playground
      config={{
        trpcApiEndpoint: 'http://localhost:3000/api/trpc',
        playgroundEndpoint: 'http://localhost:3000/api/trpc-playground',
        polling: {
          enable: true,
          interval: 4000,
        },
        request: {
          globalHeaders: {},
        },
      }}
    />
  )
}
