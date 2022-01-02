import { Playground } from '../../components/src'
import { trpc } from '../../components/src/components/playground/provider'

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
    <div>
      <Playground>
        <Component />
      </Playground>
    </div>
  )
}

export default IndexPage
