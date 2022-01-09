import { useAtom } from 'jotai'
import { configAtom } from './provider'

export const Toolbar = () => {
  const [config] = useAtom(configAtom)
  return (
    <div className='p-4 text-center'>
      <p className='p-2 bg-blue-500 inline-block rounded-sm font-bold'>{config.trpcApiEndpoint}</p>
    </div>
  )
}
