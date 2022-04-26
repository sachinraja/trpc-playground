import { useAtom } from 'jotai'
import { configAtom } from './provider'

export const Toolbar = () => {
  const [config] = useAtom(configAtom)

  return (
    <div className='flex px-1 py-1 bg-primary shadow-md'>
      <p className='p-2 inline-block  font-bold'>{config.trpcApiEndpoint}</p>
    </div>
  )
}
