import clsx from 'clsx'
import { ComponentChildren, ComponentProps } from 'preact'
import { forwardRef } from 'preact/compat'

type BaseTabProps = {
  children: ComponentChildren
} & ComponentProps<'div'>

export const BaseTab = forwardRef<HTMLDivElement, BaseTabProps>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('bg-primary flex-shrink-0 p-2 rounded-sm inline-flex items-center', className)}
    {...props}
  >
    {children}
  </div>
))
