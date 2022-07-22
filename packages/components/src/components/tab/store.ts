import { EditorView } from '@codemirror/view'
import { atom, WritableAtom } from 'jotai'
import { GlobalState, Headers, Tab } from './types'

const currentTab = {
  id: '0',
  name: 'basic query',
  doc: "await query('hello', { text: 'client' })\nexport {}",
}

const defaultConfig = {
  tabs: [currentTab],
  headers: {},
}

export const getInitialState = (): GlobalState => {
  const config = localStorage.getItem('trpc-playground-config')

  if (config !== null) {
    try {
      return JSON.parse(config) || defaultConfig
    } catch {}
  }
  return defaultConfig
}

const stateAtom = atom(getInitialState())

export const headersAtom: WritableAtom<Headers, (old: Headers) => Headers> = atom(
  (get) => get(stateAtom).headers || {},
  (get, set, updateHeaders) => {
    const oldValue = get(stateAtom)
    const newValue = { ...oldValue, headers: updateHeaders(oldValue.headers) }

    set(stateAtom, newValue)
    localStorage.setItem('trpc-playground-config', JSON.stringify(newValue))
  },
)

export const tabsAtom: WritableAtom<Tab[], (old: Tab[]) => Tab[]> = atom(
  (get) => get(stateAtom).tabs || [],
  (get, set, updateTabs) => {
    const oldValue = get(stateAtom)
    const newValue = { ...oldValue, tabs: updateTabs(oldValue.tabs) }

    set(stateAtom, newValue)
    localStorage.setItem('trpc-playground-config', JSON.stringify(newValue))
  },
)

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
export const editorAtom = atom<EditorView | null>(null)
