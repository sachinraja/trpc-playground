import { PlusIcon } from '@heroicons/react/solid'
import { useAtom } from 'jotai'
import { BaseTab, TabGroup } from './base'
import { PlaygroundTab } from './playground'
import { currentTabIndexAtom, previousTabIndexAtom, tabsAtom, totalTabsCreatedAtom } from './store'
import { Tab } from './types'

const createNewDefaultTab = (id: number): Tab => ({
  id,
  name: 'New Tab',
  doc: "await query('hello', { text: 'client' })\nexport {}",
})

export const TabManager = () => {
  const [tabs, setTabs] = useAtom(tabsAtom)
  const [, setPreviousTabIndex] = useAtom(previousTabIndexAtom)
  const [currentTabIndex, setCurrentTabIndex] = useAtom(currentTabIndexAtom)
  const [totalTabsCreated, setTotalTabsCreated] = useAtom(totalTabsCreatedAtom)

  return (
    <TabGroup className='mx-2'>
      {tabs.map((tab, index) => (
        <PlaygroundTab
          key={tab.id}
          index={index}
        />
      ))}

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
    </TabGroup>
  )
}
