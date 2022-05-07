import { atom } from 'jotai'
import { Tab } from './types'

const currentTab = {
  id: '0',
  name: 'basic query',
  doc: "await query('hello', { text: 'client' })\nexport {}",
}

export const tabsAtom = atom<Tab[]>([
  currentTab,
])
export const totalTabsCreatedAtom = atom(3)
export const previousTabIdAtom = atom('0')
const currentTabIdAtom = atom('0')

export const updateCurrentTabIdAtom = atom((get) => get(currentTabIdAtom), (get, set, update: string) => {
  set(previousTabIdAtom, get(currentTabIdAtom))
  set(currentTabIdAtom, update)
})

export const currentTabAtom = atom((get) => {
  return get(tabsAtom).find((tab) => tab.id === get(currentTabIdAtom))!
})

export const previousTabAtom = atom((get) => {
  return get(tabsAtom).find((tab) => tab.id === get(previousTabIdAtom))
})

export const currentTabIndexAtom = atom((get) => {
  return get(tabsAtom).findIndex((tab) => tab.id === get(currentTabIdAtom))
})

export const queryBuilderOpened = atom<boolean>(false)
