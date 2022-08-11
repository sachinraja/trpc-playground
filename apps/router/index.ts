import * as trpc from '@trpc/server'
import superjson from 'superjson'
import { z } from 'zod'

const users = [
  { name: 'user1', id: 0 },
  { name: 'user2', id: 1 },
  { name: 'user3', id: 2 },
]

export const appRouter = trpc
  .router()
  .query('get-users', {
    resolve() {
      return users
    },
  })
  .query('get-user-by-id', {
    input: z.object({
      userId: z.number(),
    }),
    resolve({ input: { userId } }) {
      return users.find(({ id }) => id === userId)
    },
  })
  .mutation('remove-last-user', {
    resolve() {
      users.splice(users.length - 1, 1)
      return users
    },
  })
  .mutation('insert-user', {
    input: z.object({
      id: z.number(),
      name: z.string(),
    }),
    resolve({ input }) {
      users.push(input)
      return input
    },
  })
  .transformer(superjson)

export type AppRouter = typeof appRouter
