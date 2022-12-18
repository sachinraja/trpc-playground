import { closestCenter, DndContext, DndContextProps, DragOverlay, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useAtom } from 'jotai'
import { useCallback } from 'preact/hooks'
import { BaseTab } from './base'
import { MouseSensor } from './dnd-sensors'
import { Draggable } from './draggable'
import { PlaygroundTab } from './playground'
import { currentTabAtom, currentTabIndexAtom, tabsAtom, updateCurrentTabIdAtom } from './store'
import { Tab } from './types'
import { createNewDefaultTab } from './utils'

export const TabGroup = () => {
  const [tabs, setTabs] = useAtom(tabsAtom)
  const [currentTab] = useAtom(currentTabAtom)
  const [currentTabIndex] = useAtom(currentTabIndexAtom)
  const [, updateCurrentTabId] = useAtom(updateCurrentTabIdAtom)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  )

  const handleDragEnd = useCallback<NonNullable<DndContextProps['onDragEnd']>>(({ active, over }) => {
    if (!over) return

    setTabs((tabs) => {
      const activeTabIndex = tabs.findIndex((tab) => tab.id === active.id)
      const newIndex = tabs.findIndex((tab) => tab.id === over.id)
      const newTabs = arrayMove(tabs, activeTabIndex, newIndex)

      updateCurrentTabId(active.id as string)
      return newTabs
    })
  }, [tabs, currentTab])

  return (
    <div className='flex mt-2 flex-shrink-0 space-x-2 overflow-hidden scroll mx-2 h-8 items-center'>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }) => {
          updateCurrentTabId(active.id as string)
        }}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={tabs} strategy={horizontalListSortingStrategy}>
          {tabs.map((tab, index) => {
            return (
              <Draggable className='flex-shrink-0' key={tab.id} id={tab.id}>
                <PlaygroundTab
                  key={tab.id}
                  index={index}
                />
              </Draggable>
            )
          })}
        </SortableContext>

        <DragOverlay>
          {currentTab && (
            <PlaygroundTab
              key={currentTab.id}
              index={currentTabIndex}
            />
          )}
        </DragOverlay>
      </DndContext>

      <BaseTab>
        <button
          title='Create new tab'
          onClick={() => {
            const newTab = createNewDefaultTab()
            const newTabs: Tab[] = [...tabs, newTab]
            setTabs(() => newTabs)
            updateCurrentTabId(newTab.id)
          }}
        >
          <PlusIcon width={20} height={20} className='text-neutral-200' />
        </button>
      </BaseTab>
    </div>
  )
}
