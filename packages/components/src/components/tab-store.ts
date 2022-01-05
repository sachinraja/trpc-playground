import { atom } from 'jotai'
import { Tab } from './tab-manager'

const currentTab = {
  id: 0,
  name: 'basic query',
  doc: "await query('hello', { text: 'client' })\nexport {}",
}

export const tabsAtom = atom<Tab[]>([
  currentTab,
  {
    id: 1,
    name: 'Vitest',
    doc: 'const run = () => expect(1).toBeNumber()',
  },
  {
    id: 2,
    name: 'Console Log',
    doc: "console.log('Hello world!')",
  },
])
export const totalTabsCreatedAtom = atom(3)
export const previousTabIndexAtom = atom(0)
export const currentTabIndexAtom = atom(0)
export const currentTabAtom = atom((get) => get(tabsAtom)[get(currentTabIndexAtom)])
