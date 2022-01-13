import { arrayMove } from '@dnd-kit/sortable'
import { PlusIcon } from '@heroicons/react/solid'
import { useAtom } from 'jotai'
import { BaseTab } from './base'
import { TabGroup } from './group'
import { PlaygroundTab } from './playground'
import { currentTabAtom, currentTabIndexAtom, previousTabIndexAtom, tabsAtom, totalTabsCreatedAtom } from './store'
import { Tab } from './types'

const createNewDefaultTab = (totalTabsCreated: number): Tab => ({
  id: totalTabsCreated.toString(),
  name: 'New Tab',
  doc: "await query('hello', { text: 'client' })\nexport {}",
})

export const TabManager = () => {
  const [tabs, setTabs] = useAtom(tabsAtom)
  const [, setPreviousTabIndex] = useAtom(previousTabIndexAtom)
  const [currentTabIndex, setCurrentTabIndex] = useAtom(currentTabIndexAtom)
  const [totalTabsCreated, setTotalTabsCreated] = useAtom(totalTabsCreatedAtom)
  const [currentTab] = useAtom(currentTabAtom)
  return (
    <TabGroup
      className='mx-2'
      onDragEnd={({ active, over }) => {
        const activeTabIndex = tabs.findIndex((tab) => tab.id === active.id)
        console.log(active, over)
        if (over === null || active.id === over.id) {
          setPreviousTabIndex(currentTabIndex)
          setCurrentTabIndex(activeTabIndex)
        } else {
          setTabs((tabs) => {
            const newIndex = tabs.findIndex((tab) => tab.id === over.id)
            const newTabs = arrayMove(tabs, activeTabIndex, newIndex)
            const newCurrentTabIndex = newTabs.findIndex((tab) => tab.id === currentTab.id)

            setPreviousTabIndex(newCurrentTabIndex)
            setCurrentTabIndex(newCurrentTabIndex)
            return newTabs
          })
        }
      }}
      tabs={tabs}
      items={tabs.map((tab, index) => (
        <PlaygroundTab
          key={tab.id}
          index={index}
        />
      ))}
      after={
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
      }
    />
  )
}
