import { trpc } from 'lib/trpc'
import { Playground } from '../../core/src/components/playground'

const IndexPage = () => {
  const hello = trpc.useQuery(['hello', { text: 'client' }])
  if (!hello.data) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <p>{hello.data.greeting}</p>
      <Playground tsTypes={['hi']} />
    </div>
  )
}

export default IndexPage
