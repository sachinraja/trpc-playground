import clsx from 'clsx'
import { ComponentChildren, ComponentProps } from 'preact'

type BaseTabProps = {
  children: ComponentChildren
} & ComponentProps<'div'>

export const BaseTab = ({ children, className, ...props }: BaseTabProps) => (
  <div className={clsx('bg-primary p-2 rounded-sm inline-flex items-center', className)} {...props}>
    {children}
  </div>
)

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
