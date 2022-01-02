import { useAtom } from 'jotai'
import { AddIcon, CloseIcon } from '../icon'
import { BaseTab, TabGroup } from '../tab'
import { currentTabIndexAtom, previousTabIndexAtom, tabsAtom, totalTabsCreatedAtom } from '../tab-store'

export type Tab = {
  id: number
  name: string
  doc: string
}

const createNewDefaultTab = (id: number): Tab => ({
  id,
  name: 'New Tab',
  doc: '',
})

export const TabManager = () => {
  const [tabs, setTabs] = useAtom(tabsAtom)
  const [, setPreviousTabIndex] = useAtom(previousTabIndexAtom)
  const [currentTabIndex, setCurrentTabIndex] = useAtom(currentTabIndexAtom)
  const [totalTabsCreated, setTotalTabsCreated] = useAtom(totalTabsCreatedAtom)

  return (
    <TabGroup className='mx-2'>
      {tabs.map((tab, index) => {
        return (
          <BaseTab
            key={tab.id}
            className={currentTabIndex === index ? undefined : 'opacity-70'}
          >
            <button
              onClick={() => {
                setPreviousTabIndex(currentTabIndex)
                setCurrentTabIndex(index)
              }}
            >
              <p>{tab.name}</p>
            </button>

            <button
              className='ml-4'
              onClick={() => {
                setTabs((tabs) => {
                  const newTabs = [...tabs]
                  newTabs.splice(index, 1)
                  if (newTabs.length === 0) {
                    newTabs.push(createNewDefaultTab(totalTabsCreated))
                    setTotalTabsCreated((totalTabsCreated) => totalTabsCreated + 1)
                  }

                  let newPreviousTabIndex = currentTabIndex
                  let newIndex = currentTabIndex
                  const lastNewTabsIndex = newTabs.length - 1
                  if (newIndex > lastNewTabsIndex) {
                    newPreviousTabIndex = lastNewTabsIndex
                    newIndex = lastNewTabsIndex
                  }

                  setPreviousTabIndex(newPreviousTabIndex)
                  setCurrentTabIndex(newIndex)

                  return newTabs
                })
              }}
            >
              <CloseIcon title='Close tab' className='text-slate-800' width={20} height={20} />
            </button>
          </BaseTab>
        )
      })}

      <BaseTab>
        <button
          onClick={() => {
            const newTabs: Tab[] = [...tabs, createNewDefaultTab(totalTabsCreated)]
            setTabs(newTabs)
            setTotalTabsCreated((totalTabsCreated) => totalTabsCreated + 1)
            setPreviousTabIndex(currentTabIndex)
            setCurrentTabIndex(newTabs.length - 1)
          }}
        >
          <AddIcon title='Create new tab' />
        </button>
      </BaseTab>
    </TabGroup>
  )
}
