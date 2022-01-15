import { Tab } from './types'

export const createNewDefaultTab = (id: number): Tab => ({
  id: id.toString(),
  name: 'New Tab',
  doc: "await query('hello', { text: 'client' })\nexport {}",
})
