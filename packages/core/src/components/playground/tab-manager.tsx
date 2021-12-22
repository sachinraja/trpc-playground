import { AddIcon, CloseIcon } from '../icon'
import { BaseTab, TabGroup } from '../tab'
import { useTabStore } from '../tab-store'

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
  const {
    tabs,
    setTabs,
    currentTabIndex,
    setCurrentTabIndex,
    incrementTotalTabsCreated,
    setCurrentTabId,
  } = useTabStore()

  return (
    <TabGroup className='mx-2'>
      {tabs.map((tab, index) => {
        return (
          <BaseTab
            key={tab.id}
            className={currentTabIndex === index ? undefined : 'opacity-70'}
          >
            <button onClick={() => setCurrentTabIndex(index)}>
              <p>{tab.name}</p>
            </button>

            <button
              className='ml-4'
              onClick={() => {
                const newTabs = [...tabs]
                newTabs.splice(index, 1)
                if (newTabs.length === 0) {
                  const newTotalTabsCreated = incrementTotalTabsCreated()
                  newTabs.push(createNewDefaultTab(newTotalTabsCreated))
                }

                let newIndex = currentTabIndex
                const lastNewTabsIndex = newTabs.length - 1
                if (newIndex > lastNewTabsIndex) newIndex = lastNewTabsIndex

                setTabs(newTabs)
                setCurrentTabId(newTabs[newIndex].id)
                setCurrentTabIndex(newIndex)
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
            const newTotalTabsCreated = incrementTotalTabsCreated()

            const newTabs: Tab[] = [...tabs, createNewDefaultTab(newTotalTabsCreated)]
            setTabs(newTabs)
            setCurrentTabIndex(newTabs.length - 1)
          }}
        >
          <AddIcon title='Create new tab' />
        </button>
      </BaseTab>
    </TabGroup>
  )
}
