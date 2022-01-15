import { closestCenter, DndContext, DndContextProps, DragOverlay, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { PlusIcon } from '@heroicons/react/solid'
import { useAtom } from 'jotai'
import { useCallback } from 'preact/hooks'
import { BaseTab } from './base'
import { MouseSensor } from './dnd-sensors'
import { Draggable } from './draggable'
import { PlaygroundTab } from './playground'
import { currentTabAtom, currentTabIndexAtom, previousTabIndexAtom, tabsAtom, totalTabsCreatedAtom } from './store'
import { Tab } from './types'
import { createNewDefaultTab } from './utils'

export const TabGroup = () => {
  const [tabs, setTabs] = useAtom(tabsAtom)
  const [, setPreviousTabIndex] = useAtom(previousTabIndexAtom)
  const [currentTab] = useAtom(currentTabAtom)
  const [currentTabIndex, setCurrentTabIndex] = useAtom(currentTabIndexAtom)
  const [totalTabsCreated, setTotalTabsCreated] = useAtom(totalTabsCreatedAtom)

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

      setPreviousTabIndex(newIndex)
      setCurrentTabIndex(newIndex)
      return newTabs
    })
  }, [tabs, setTabs, currentTab, setPreviousTabIndex, setCurrentTabIndex])

  return (
    <div className='flex flex-shrink-0 space-x-2 overflow-x-scroll scroll mx-2'>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }) => {
          console.log('hi')
          const activeTabIndex = tabs.findIndex((tab) => tab.id === active.id)

          setPreviousTabIndex(currentTabIndex)
          setCurrentTabIndex(activeTabIndex)
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
          <PlaygroundTab
            key={currentTab.id}
            index={currentTabIndex}
          />
        </DragOverlay>
      </DndContext>

      <BaseTab>
        <button
          title='Create new tab'
          onClick={() => {
            const newTabs: Tab[] = [...tabs, createNewDefaultTab(totalTabsCreated)]
            setTabs(newTabs)
            setTotalTabsCreated((totalTabsCreated) => totalTabsCreated + 1)
            setPreviousTabIndex(currentTabIndex)
            setCurrentTabIndex(newTabs.length - 1)
          }}
        >
          <PlusIcon width={20} height={20} />
        </button>
      </BaseTab>
    </div>
  )
}
