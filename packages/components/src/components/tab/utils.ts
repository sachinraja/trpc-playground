import { Tab } from './types'

export const createNewDefaultTab = (id: number): Tab => ({
  id,
  name: 'New Tab',
  doc: "await query('hello', { text: 'client' })\nexport {}",
})
