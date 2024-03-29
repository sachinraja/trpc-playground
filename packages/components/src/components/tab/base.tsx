import clsx from 'clsx'
import { ComponentChildren, ComponentProps } from 'preact'
import { forwardRef } from 'preact/compat'

type BaseTabProps = {
  children: ComponentChildren
} & ComponentProps<'div'>

export const BaseTab = forwardRef<HTMLDivElement, BaseTabProps>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('bg-primary p-2 inline-flex items-center h-9 rounded-sm', className)}
    {...props}
  >
    {children}
  </div>
))
