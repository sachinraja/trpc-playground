import { Tab } from './types'

export const createNewDefaultTab = (): Tab => ({
  id: Math.random().toFixed(5).slice(2),
  name: 'New Tab',
  doc: "await trpc.greeting.query({ text: 'client' })\nexport {}",
})
