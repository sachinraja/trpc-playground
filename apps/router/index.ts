import * as trpc from '@trpc/server'
import superjson from 'superjson'
import { z } from 'zod'

const users = ['user1', 'user2', 'user3']

export const appRouter = trpc
  .router()
  .query('hello', {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input, ctx, type }) {
      console.log(ctx, type)
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
      }
    },
  })
  .query('hello_num', {
    input: z
      .object({
        text: z.number(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
      }
    },
  })
  .query('subtract_nums', {
    input: z
      .object({
        a: z.number(),
        b: z.number(),
      }),
    resolve({ input }) {
      return {
        sum: input.a - input.b,
      }
    },
  })
  .query('add_nums', {
    input: z
      .object({
        a: z.number(),
        b: z.number(),
      }),
    resolve({ input }) {
      return {
        sum: input.a + input.b,
      }
    },
  })
  .mutation('delete_last_user', {
    resolve() {
      users.splice(users.length - 1, 1)
      return users
    },
  })
  .query('no-args', {
    resolve() {
      return 5
    },
  })
  .query('date', {
    input: z.date(),
    async resolve({ input }) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { serverTime: new Date(), requestTime: input }
    },
  })
  .transformer(superjson)

export type AppRouter = typeof appRouter
