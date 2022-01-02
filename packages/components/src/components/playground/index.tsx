import { ComponentChildren } from 'preact'
import { Editor } from '../editor'
import { Toolbar } from '../toolbar'
import { PlaygroundProvider } from './provider'
import { TabManager } from './tab-manager'

export type PlaygroundProps = {
  tsTypes?: string[]
  children?: ComponentChildren
}

export const Playground = ({ children }: PlaygroundProps) => {
  return (
    <PlaygroundProvider>
      <div className='text-white bg-slate-800 pt-4'>
        <TabManager />
        <Toolbar />
        <Editor />
      </div>
      {children}
    </PlaygroundProvider>
  )
}
