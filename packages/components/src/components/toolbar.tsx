import { useAtom } from 'jotai'
import { configAtom } from './playground/provider'

export const Toolbar = () => {
  const [config] = useAtom(configAtom)
  return (
    <div className='p-4 text-center'>
      <p className='p-2 bg-primary inline-block rounded-md'>{config.endpoint}</p>
    </div>
  )
}
