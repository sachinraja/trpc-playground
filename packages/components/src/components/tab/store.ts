import { EditorView } from '@codemirror/view'
import { atom } from 'jotai'
import { GlobalState } from './types'
import { createNewDefaultTab } from './utils'

const defaultConfig = {
  tabs: [createNewDefaultTab()],
  headers: {},
  currentTabId: '0',
}

export const getInitialState = (): GlobalState => {
  const config = localStorage.getItem('trpc-playground-config')

  if (config !== null) {
    try {
      return JSON.parse(config) || defaultConfig
      // eslint-disable-next-line no-empty
    } catch {}
  }
  return defaultConfig
}

const stateAtom = atom(getInitialState())

const localStorageStateAtom = <
  TKey extends keyof GlobalState,
>(key: TKey) =>
  atom(
    (get) => get(stateAtom)[key],
    (get, set, update: (previousValue: GlobalState[TKey]) => GlobalState[TKey]) => {
      const oldValue = get(stateAtom)
      const newValue = { ...oldValue, [key]: update(oldValue[key]) }

      set(stateAtom, newValue)
      localStorage.setItem('trpc-playground-config', JSON.stringify(newValue))
    },
  )

export const headersAtom = localStorageStateAtom('headers')
export const tabsAtom = localStorageStateAtom('tabs')
export const currentTabIdAtom = localStorageStateAtom('currentTabId')

export const previousTabIdAtom = atom('0')

export const updateCurrentTabIdAtom = atom(
  (get) => get(currentTabIdAtom),
  (get, set, update: string) => {
    set(previousTabIdAtom, get(currentTabIdAtom))
    set(currentTabIdAtom, () => update)
  },
)

export const currentTabAtom = atom((get) => {
  return get(tabsAtom).find((tab) => tab.id === get(currentTabIdAtom))!
})

export const previousTabAtom = atom((get) => {
  return get(tabsAtom).find((tab) => tab.id === get(previousTabIdAtom))
})

export const currentTabIndexAtom = atom((get) => {
  return get(tabsAtom).findIndex((tab) => tab.id === get(currentTabIdAtom))
})

export const queryBuilderOpened = atom(false)
export const editorAtom = atom<EditorView | null>(null)
