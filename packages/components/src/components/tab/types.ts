export type Tab = {
  id: string
  name: string
  doc: string
}

export type Headers = Record<string, string>

export interface GlobalState {
  tabs: Tab[]
  headers: Headers
  currentTabId: string
}
