import { Playground } from '../../components/src'
import { trpc } from '../../components/src/components/provider'

const Component = () => {
  // @ts-expect-error this exists, trpc just can't find it
  const hello = trpc.useQuery(['hello', { text: 'client' }])
  if (!hello.data) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <p>{hello.data.greeting}</p>
      <p></p>
    </div>
  )
}

const IndexPage = () => {
  return (
    <Playground config={{ endpoint: 'http://localhost:3000/api/trpc' }}>
      <Component />
    </Playground>
  )
}

export default IndexPage
