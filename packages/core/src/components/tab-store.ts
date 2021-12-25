import { atom } from 'jotai'
import { Tab } from './playground/tab-manager'

const currentTab = {
  id: 0,
  name: 'Vitest',
  doc: 'const run = () => expect(1).toBeNumber()',
}

export const tabsAtom = atom<Tab[]>([
  currentTab,
  {
    id: 1,
    name: 'Tab 2 | gql',
    doc: "console.log('Hell world!')",
  },
  {
    id: 2,
    name: 'Tab 3 | gql',
    doc: "console.log('Hello world!')",
  },
])
export const totalTabsCreatedAtom = atom(3)
export const previousTabIndexAtom = atom(0)
export const currentTabIndexAtom = atom(0)
export const currentTabAtom = atom((get) => get(tabsAtom)[get(currentTabIndexAtom)])
