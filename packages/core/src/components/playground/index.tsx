import { ComponentChildren } from 'preact'
import { useState } from 'preact/hooks'
import { Editor } from '../editor'
import { AddIcon } from '../icon'
import { BaseTab, Tab, TabGroup } from '../tab'
import { Toolbar } from '../toolbar'
import { PlaygroundProvider } from './provider'

export type PlaygroundProps = {
  tsTypes?: string[]
  children?: ComponentChildren
}

export const Playground = ({ children }: PlaygroundProps) => {
  const [tabs, setTabs] = useState([])

  return (
    <PlaygroundProvider>
      <div className='trpc-playground'>
        <div className='text-white bg-slate-800 pt-4'>
          <TabGroup tabs={tabs}>
            <Tab>hi</Tab>
            <Tab>rea</Tab>
            <Tab>rea</Tab>
            <Tab>rea</Tab>
            <Tab>rea</Tab>
            <Tab>rearoueagreaiylrgeyafuu</Tab>
            <Tab>rearoueagreaiylrgeyafuu</Tab>
            <Tab>rearoueagreaiylrgeyafuu</Tab>
            <BaseTab>
              <AddIcon title='Create new tab' />
            </BaseTab>
          </TabGroup>

          <Toolbar />

          <Editor />
        </div>
      </div>
      {children}
    </PlaygroundProvider>
  )
}
