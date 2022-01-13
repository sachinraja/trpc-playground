import { closestCenter, DndContext, DndContextProps, useSensor, useSensors } from '@dnd-kit/core'
import { horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import clsx from 'clsx'
import { ComponentChildren } from 'preact'
import { KeyboardSensor, MouseSensor } from './dnd-sensors'
import { Tab } from './types'

type TabGroupProps = {
  tabs: Tab[]
  onDragEnd: DndContextProps['onDragEnd']
  items: ComponentChildren
  after?: ComponentChildren
  className?: string
}

export const TabGroup = ({ tabs, onDragEnd, items, after, className }: TabGroupProps) => {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  return (
    <div className={clsx('flex space-x-2 overflow-x-scroll scroll', className)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={tabs} strategy={horizontalListSortingStrategy}>
          {items}
        </SortableContext>
      </DndContext>
      {after}
    </div>
  )
}
