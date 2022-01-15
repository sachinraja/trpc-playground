import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ComponentChildren, ComponentProps } from 'preact'
import { useMemo } from 'preact/hooks'

export type DraggableProps = {
  id: string
  className?: string
  children: ComponentChildren
}

export const Draggable = ({ id, className, children }: DraggableProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
  }), [transform, transition])

  const props: ComponentProps<'div'> = useMemo(() => ({
    ref: setNodeRef,
    ...listeners,
    ...attributes,
    style,
  }), [setNodeRef, listeners, attributes, style])

  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}
