import { ComponentChildren, FunctionalComponent } from 'preact'
import { CloseIcon } from './icon'

type TabProps = {
  children: ComponentChildren
}

export const BaseTab = ({ children }: TabProps) => (
  <div className='bg-primary p-2 rounded-sm inline-flex items-center'>
    {children}
  </div>
)

export const Tab = ({ children }: TabProps) => {
  return (
    <BaseTab>
      {children}
      <CloseIcon title='Close tab' className='ml-4 text-slate-800' width={20} height={20} />
    </BaseTab>
  )
}

export const TabGroup: FunctionalComponent = ({ children }) => {
  return <div className='flex space-x-2 overflow-x-scroll scroll'>{children}</div>
}
