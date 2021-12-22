import clsx from 'clsx'
import { ComponentChildren, ComponentProps, FunctionalComponent } from 'preact'
import { CloseIcon } from './icon'

type BaseTabProps = {
  children: ComponentChildren
} & ComponentProps<'div'>

export const BaseTab = ({ children, className, ...props }: BaseTabProps) => (
  <div className={clsx('bg-primary p-2 rounded-sm inline-flex items-center', className)} {...props}>
    {children}
  </div>
)

export const Tab: FunctionalComponent = ({ children }) => {
  return (
    <BaseTab>
      {children}
      <CloseIcon title='Close tab' className='ml-4 text-slate-800' width={20} height={20} />
    </BaseTab>
  )
}

type TabGroupProps = {
  children: ComponentChildren
  className?: string
}

export const TabGroup = ({ children, className }: TabGroupProps) => {
  return (
    <div className={clsx('flex space-x-2 overflow-x-scroll scroll', className)}>
      {children}
    </div>
  )
}
