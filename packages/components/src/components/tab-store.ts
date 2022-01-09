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
    name: 'another query',
    doc: "await query('subtract_nums', { a: 2, b: 5 })\nexport {}",
  },
  {
    id: 2,
    name: 'third query',
    doc: "await query('add_nums', { a: 2, b: 5 })\nexport {}",
  },
])
export const totalTabsCreatedAtom = atom(3)
export const previousTabIndexAtom = atom(0)
export const currentTabIndexAtom = atom(0)
export const currentTabAtom = atom((get) => get(tabsAtom)[get(currentTabIndexAtom)])
