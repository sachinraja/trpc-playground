import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { z } from 'zod'

const users = [
  { name: 'user1', id: 0 },
  { name: 'user2', id: 1 },
  { name: 'user3', id: 2 },
]

const t = initTRPC.create({ transformer: superjson })

export const appRouter = t.router({
  getUsers: t.procedure.query(() => {
    return users
  }),
  getUsersById: t.procedure
    .input(z.object({
      userId: z.number(),
    }))
    .query(({ input }) => {
      return users.find(({ id }) => id === input.userId)
    }),
  removeLastUser: t.procedure.mutation(() => {
    users.splice(users.length - 1, 1)
    return users
  }),
  insertUser: t.procedure
    .input(z.object({
      id: z.number(),
      name: z.string(),
    }))
    .mutation(({ input }) => {
      users.push(input)
      return input
    }),
})

export type AppRouter = typeof appRouter
