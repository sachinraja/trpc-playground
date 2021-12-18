import { Editor } from './editor'
import { AddIcon } from './icon'
import { BaseTab, Tab, TabGroup } from './tab'
import { Toolbar } from './toolbar'

export type PlaygroundProps = {
  tsTypes: string[]
}

export const Playground = () => {
  return (
    <div className='trpc-playground'>
      <div className='text-white bg-slate-800 pt-4'>
        <TabGroup>
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
  )
}
