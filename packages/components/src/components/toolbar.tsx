import { useAtom } from 'jotai'
import { useState } from 'preact/hooks'
import { Docs } from './docs'
import { configAtom } from './provider'
import { Settings } from "./settings"

export const Toolbar = () => {
  const [config] = useAtom(configAtom)
  const [showDocs, setShowDocs] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className='flex px-1 py-1 bg-primary shadow-md justify-between'>
      <p className='p-2 inline-block font-bold'>{config.trpcApiEndpoint}</p>
      <div className="flex items-center">
        <NavButton onClick={() => setShowDocs(true)}>Docs</NavButton>
        <NavButton onClick={() => setShowSettings(true)}>Settings</NavButton>
      </div>
      {showDocs && <Docs hide={() => setShowDocs(false)} />}
      {showSettings && <Settings hide={() => setShowSettings(false)} />}
    </div >
  )
}

const NavButton: React.FC<{ onClick?: () => void }> = ({ children, onClick }) => {
  return (
    <span
      onClick={onClick}
      className='mx-1 px-2 font-semibold bg-secondary h-fit rounded-sm cursor-pointer shadow-lg'
    >
      {children}
    </span>
  )
}