import { Playground } from '@trpc-playground/components'

const IndexPage = () => {
  return <Playground config={{ endpoint: 'http://localhost:3000/api/trpc' }} />
}

export default IndexPage
