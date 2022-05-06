import { useAtom } from 'jotai'
import { useState } from 'preact/hooks'
import { Docs } from './docs'
import { configAtom } from './provider'

export const Toolbar = () => {
  const [config] = useAtom(configAtom)
  const [showDocs, setShowDocs] = useState(false)

  return (
    <div className='flex px-1 py-1 bg-primary shadow-md justify-between'>
      <p className='p-2 inline-block font-bold'>{config.trpcApiEndpoint}</p>
      <p className='p-2 font-semibold' onClick={() => setShowDocs(true)}>Docs</p>
      {showDocs && <Docs hide={() => setShowDocs(false)} />}
    </div>
  )
}
