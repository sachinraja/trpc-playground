import create from 'zustand'
import { combine } from 'zustand/middleware'
import { Tab } from './playground/tab-manager'

export const useTabStore = create(
  combine(
    {
      tabs: [
        {
          id: 1,
          name: 'Vitest',
          doc: 'const run = () => expect(1).toBeNumber()',
        },
        {
          id: 2,
          name: 'Tab 2 | gql',
          doc: "console.log('Hell world!')",
        },
        {
          id: 3,
          name: 'Tab 3 | gql',
          doc: "console.log('Hello world!')",
        },
      ] as Tab[],
      previousTabIndex: 0,
      currentTabIndex: 0,
      currentTabId: 1,
      totalTabsCreated: 3,
    },
    (set, get) => ({
      setTabs: (tabs: Tab[]) => set({ tabs }),
      setPreviousTabIndex: (newPreviousTabIndex: number) => set({ previousTabIndex: newPreviousTabIndex }),
      setCurrentTabIndex: (newTabIndex: number) =>
        set((state) => {
          let newPreviousTabIndex = state.currentTabIndex
          if (newPreviousTabIndex > state.tabs.length - 1) newPreviousTabIndex = newTabIndex

          return ({
            previousTabIndex: newPreviousTabIndex,
            currentTabIndex: newTabIndex,
          })
        }),
      setCurrentTabId: (newTabId: number) => set({ currentTabId: newTabId }),
      incrementTotalTabsCreated: () => {
        const newTotalTabsCreated = get().totalTabsCreated + 1
        set({ totalTabsCreated: newTotalTabsCreated })
        return newTotalTabsCreated
      },
    }),
  ),
)
